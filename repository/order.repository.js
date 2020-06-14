const { OrderModel, ProductModel } = require('../models');
const { Types: { ObjectId } } = require('mongoose');


const UserRepo = {
   createOrder: async (data) => {
      const { products } = data;

      const preparedData = { ...data };
      const notAllowedProducts = await ProductModel.find({
         '_id': {
            $in: products.map(prod => ObjectId(prod))
         },
         status: { $ne: 0 }
      });
      if (notAllowedProducts && notAllowedProducts.length) {
         // calculate price withot unavailable items
         const notAllowedProductsIds = notAllowedProducts.map(prod => prod.status !== 0);
         preparedData.products = preparedData.products.filter(p => notAllowedProductsIds.includes(p));
         preparedData.amount = preparedData.amount - notAllowedProducts.reduce((a, b) => a.amount + b.amount, 0);

         return {
            success: false,
            message: `Products: ${notAllowedProducts.map(p => p.title).join(', ')} already bought. Sorry for the inconvenience`
         }
      }

      // create order
      const order = await OrderModel.create(preparedData);
      // update products status
      await ProductModel.update({ '_id': {
         $in: products.map(prod => ObjectId(prod))
      }}, { status: 1 });

      //
      return {
         success: true,
         ...order
      };
   },
}

module.exports = UserRepo;