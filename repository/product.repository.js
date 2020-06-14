const { ProductModel, OrderModel } = require('../models');
const { blobContainer } = require('../service/azure-blob-storage.service');

const ProductRepo = {
   list: async () => {
      const products = await ProductModel.find();
      return products;
   },
   create: async (data) => {
      const { file } = data;
      if (file) {
         const { blockBlobClient } = await blobContainer.uploadBlockBlob(file.originalname, file.buffer, file.size);
         data.imageUrl = blockBlobClient.url;
         data.blobName = file.originalname;
      }
      const product = await ProductModel.create(data);
      return product;
   },
   update: async (id, data) => {
      let productData = { ...data };
      const { file } = productData;

      // data preparation
      delete productData._id

      if (file) {
         const foundProd = await ProductModel.findById(id);
         if (foundProd && foundProd.blobName) {
            console.time('blob deleting...')
            const { clientRequestId } = await blobContainer.deleteBlob(foundProd.blobName);
            console.log('blob delete request: ', clientRequestId);
            console.timeEnd('blob deleting...')
         }
         const { blockBlobClient } = await blobContainer.uploadBlockBlob(file.originalname, file.buffer, file.size);
         productData.imageUrl = blockBlobClient.url;
         productData.blobName = file.originalname;
      }

      const product = await ProductModel.findByIdAndUpdate({ _id: id }, productData);
      return product;
   },
   delete: async (id) => {
      const foundProd = await ProductModel.findById(id);

      const existingOrder = await OrderModel.findOne({
         products: {
            $in: [id]
         },
      });

      if (existingOrder) {
         return {
            success: false,
            message: `this product belongs to an active order ${existingOrder._id}`
         }
      }

      if (foundProd && foundProd.imageUrl) {
         console.time('blob deleting...')
         await blobContainer.deleteBlob(foundProd.blobName);
         console.timeEnd('blob deleting...')
      }
      const removedProduct = await ProductModel.findByIdAndDelete(id);
      return {
         success: true,
         ...removedProduct.toJSON()
      };
   }
}

module.exports = ProductRepo;