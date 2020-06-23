const { ProductModel, OrderModel } = require('../models');
const { blobContainer } = require('../service/azure-blob-storage.service');

const ProductRepo = {
   list: async () => {
      const products = await ProductModel.find();
      return products;
   },
   create: async (data) => {
      const { file, gallery } = data;
      if (file) {
         const { blockBlobClient } = await blobContainer.uploadBlockBlob(file.originalname, file.buffer, file.size);
         data.imageUrl = blockBlobClient.url;
         data.blobName = file.originalname;
      }
      if (gallery) {
         const savedFiles = await Promise.all(gallery.map(galleryFile => {
            return blobContainer.uploadBlockBlob(galleryFile.originalname, galleryFile.buffer, galleryFile.size);
         }))
         console.log('savedFiles', savedFiles)
         data.gallery = savedFiles.map(({ blockBlobClient: { url } }, idx) => ({ name: gallery[idx].originalname, url }));
      }
      const product = await ProductModel.create(data);
      return product;
   },
   update: async (id, data) => {
      let productData = { ...data };
      const { file, gallery } = productData;

      // data preparation
      delete productData._id

      // udpate main product image
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

      if (gallery) {
         const savedFiles = await Promise.all(gallery.map(galleryFile => {
            return blobContainer.uploadBlockBlob(galleryFile.originalname, galleryFile.buffer, galleryFile.size);
         }))
         productData.gallery = savedFiles.map(({ blockBlobClient: { url } }, idx) => ({ name: gallery[idx].originalname, url }));
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