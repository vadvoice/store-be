const express = require('express');
const router = express.Router();

const { OrderRepo } = require('../repository');

/**
 * GET list of active orders
 */
router.get('/activeOrders', async (req, res, next) => {
   const orders = await OrderRepo.activeOrders();
   res.json(orders);
})

/**
 * POST resolve order
 */
router.post('/resolve/:orderId', async (req, res, next) => {
   const { orderId } = req.params;
   const resolve = await OrderRepo.resolve(orderId);
   res.json(resolve);
})

module.exports = router;
