const express = require('express');
const router = express.Router();

const { Stripe, Mailgun } = require('../service');
const { appConfig } = require('../config');
const { OrderRepo } = require('../repository');
const orderTemplate = require('../public/email-templates/order-template');
const { ProductModel } = require('../models');
const { Types: { ObjectId } } = require('mongoose');
const { constants } = require('../constants');

/**
 * POST payment
 */
router.post('/', async (req, res, next) => {
   const { products } = req.body;
   
   if (!products || !Array.isArray(products) || !products.length) {
      return res.status(404).send('products array is required');
   }
   try {
      const preparedProducts = products.map(prod => ({
         price_data: {
            product: prod._id,
            unit_amount: prod.amount,
            currency: prod.currency || 'usd',
          },
          quantity: 1,
      }));
   
      const session = await Stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: preparedProducts,
         mode: 'payment',
         success_url: appConfig.stripe.successUrl,
         cancel_url: appConfig.stripe.cancelUrl,
       });
       return res.json({ session });
   } catch(e) {
      console.error(e);
      next(e);
   }
});

/**
 * POST checkout
 */
router.post('/checkout', async (req, res, next) => {
   const { products } = req.body;
   if (!products || !Array.isArray(products) || !products.length) {
      return res.status(404).send('products array is required');
   }
   try {
      const order = await OrderRepo.createOrder(req.body);
      if (!order.success) {
         return next({
            ...order,
            status: 404
         })
      }
      const products = await ProductModel.find({ '_id': { $in: order.products.map(id => ObjectId(id)) } });
      const emailTemplateData = { ...order, products };

      const data = {
         from: `${constants.app.titile} <postmaster@${appConfig.mailgun.domain}>`,
         to: req.body.email,
         subject: `Order processed: ${order._id}`,
         html: `${orderTemplate(emailTemplateData)}`,
      };
      Mailgun.messages().send(data, function (error, body) {
         if (error) {
            console.error(error);
            next(error)
         }
      });

      res.json(order);
   } catch(e) {
      console.error(e);
      next(e);
   }
});

module.exports = router;
