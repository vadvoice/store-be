const express = require('express');
const { Stripe } = require('../service');
const { appConfig } = require('../config');
const router = express.Router();

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

module.exports = router;
