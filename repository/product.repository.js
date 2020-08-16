const { ProductModel, OrderModel, ProductVoteModel } = require('../models');
const { blobContainer } = require('../service/azure-blob-storage.service');

const ProductRepo = {
   list: async () => {
      const products = await ProductModel.find({ mark: 0 }).populate('productVote');
      return products;
   },
   rawList: async () => {
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
      if (gallery && gallery.length) {
         const savedFiles = await Promise.all(gallery.map(galleryFile => {
            return blobContainer.uploadBlockBlob(galleryFile.originalname, galleryFile.buffer, galleryFile.size);
         }))
         data.gallery = savedFiles.map(({ blockBlobClient: { url } }, idx) => ({ name: gallery[idx].originalname, url }));
      }
      const productVote = await ProductVoteModel.create({});
      const product = await ProductModel.create({ ...data, productVote });
      await ProductVoteModel.findByIdAndUpdate({ _id: productVote._id }, {productId: product._id })
      return product;
   },
   update: async (id, data) => {
      let productData = { ...data };
      const { file, gallery = [] } = productData;

      // data preparation
      delete productData._id

      const foundProd = await ProductModel.findById(id);

      // udpate main product image
      if (file) {
         if (foundProd && foundProd.blobName) {
            console.time('blob deleting...')
            const { clientRequestId } = await blobContainer.deleteBlob(foundProd.blobName);
            console.info('blob delete request: ', clientRequestId);
            console.timeEnd('blob deleting...')
         }
         const { blockBlobClient } = await blobContainer.uploadBlockBlob(file.originalname, file.buffer, file.size);
         productData.imageUrl = blockBlobClient.url;
         productData.blobName = file.originalname;
      }

      if (gallery && gallery.length) {
         const savedFiles = await Promise.all(gallery.map(galleryFile => {
            return blobContainer.uploadBlockBlob(galleryFile.originalname, galleryFile.buffer, galleryFile.size);
         }))
         productData.gallery = savedFiles.map(({ blockBlobClient: { url } }, idx) => ({ name: gallery[idx].originalname, url }));
         productData.gallery = foundProd.gallery.concat(productData.gallery);
      } else {
         productData.gallery = foundProd.gallery;
      }

      const product = await ProductModel.findByIdAndUpdate({ _id: id }, productData);
      return product;
   },
   mark: async (id, data) => {
      const product = await ProductModel.findByIdAndUpdate({ _id: id }, data);
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

      await ProductVoteModel.findByIdAndDelete(foundProd.productVote);
      const removedProduct = await ProductModel.findByIdAndDelete(id);
      return {
         success: true,
         ...removedProduct.toJSON()
      };
   },
   deleteGalleryItem: async (productId, galleryImageId) => {
      await ProductModel.findByIdAndUpdate(productId, { $pull: { "gallery": { name: galleryImageId } } }, { safe: true, upsert: true });
      const { clientRequestId } = await blobContainer.deleteBlob(galleryImageId);
      return clientRequestId;
   }
}

module.exports = ProductRepo;