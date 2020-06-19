const express = require('express');
const router = express.Router();

const { Stripe, Mailgun } = require('../service');
const { appConfig } = require('../config');
const { OrderRepo } = require('../repository');
const orderTemplate = require('../public/email-templates/order-template');

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

      const data = {
         from: "Mailgun Sandbox <postmaster@sandbox905bb5f0c8774509bbd94974d4ecaace.mailgun.org>",
         to: req.body.email,
         subject: "Order processed",
         html: `${orderTemplate}`
      };
      Mailgun.messages().send(data, function (error, body) {
         console.log('boody', body);
      });

      res.json(order)
   } catch(e) {
      console.error(e);
      next(e);
   }
});

module.exports = router;
