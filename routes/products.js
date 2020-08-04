const express = require('express');
const router = express.Router();

const { ProductRepo } = require('../repository');
const { isIdValid, uploadFile, isTokenExists, isAdmin } = require('../middlewares');

const uploadStrategy = uploadFile('image', 'gallery');

/**
 * GET products list.
 */
router.get('/', async (req, res, next) => {
   try {
      const products = await ProductRepo.list();
      res.json(products);
   } catch (e) {
      next(e)
   }
});

router.get('/raw', async (req, res, next) => {
   try {
      const products = await ProductRepo.rawList();
      res.json(products);
   } catch (e) {
      next(e)
   }
});

/**
 * POST craete product
 */
router.post('/', isTokenExists, isAdmin, uploadStrategy, async (req, res, next) => {
   try {
      const { body, files } = req;
      let data = { ...body }
      if (files && files.image) {
         data.file = files.image[0];
      }
      if (files && files.gallery) {
         data.gallery = files.gallery;
      }
      const product = await ProductRepo.create(data);
      res.json(product);
   } catch (e) {
      next(e)
   }
});

/**
 * PUT update product
 */
router.put('/:id', isTokenExists, isAdmin, isIdValid, uploadStrategy, async (req, res, next) => {
   const { body, files, params: { id } } = req;
   try {
      let productData = { ...body };
      if (files && files.image) {
         productData.file = files.image[0];
      } else {
         productData.file = null;
      }
      if (files && files.gallery) {
         productData.gallery = files.gallery;
      } else {
         productData.gallery = [];
      }
      const product = await ProductRepo.update(id, productData);
      res.json(product);
   } catch (e) {
      next(e);
   }
});

/**
 * POST update product marker
 */
router.post('/:id/mark', isTokenExists, isAdmin, isIdValid, async (req, res, next) => {
   const { body, params: { id } } = req;
   try {
      if (body.hasOwnProperty('mark')) {
         const product = await ProductRepo.mark(id, {mark: body.mark});
         res.json(product);
      } else {
         res.status(404).end('wrong data model');
      }
   } catch (e) {
      next(e);
   }
});

/**
 * DELETE remove product
 */
router.delete('/:id', isTokenExists, isAdmin, isIdValid, async (req, res, next) => {
   const { id } = req.params;
   try {
      const removedProduct = await ProductRepo.delete(id);
      if (removedProduct.success) {
         res.json(removedProduct);
      } else {
         res.status(404).json(removedProduct)
      }
   } catch (e) {
      next(e);
   }
});

/**
 * DELETE delete gallery item
 */
router.delete('/:productId/gallery/:galleryImageId', isTokenExists, isAdmin, async (req, res, next) => {
   const { productId, galleryImageId } = req.params;
   if (productId && galleryImageId) {
      try {
         const removedProductGalleryItem = await ProductRepo.deleteGalleryItem(productId, galleryImageId);
         res.json(removedProductGalleryItem);
      } catch (e) {
         next(e);
      }
   } else {
      res.send('productId, galleryImageId are required')
   }
});

module.exports = router;
