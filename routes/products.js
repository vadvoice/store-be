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
   console.log('files', files)
   try {
      let productData = { ...body };
      if (files && files.image) {
         productData.file = files.image[0];
      }
      if (files && files.gallery) {
         productData.gallery = files.gallery;
      }
      const product = await ProductRepo.update(id, productData);
      res.json(product);
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

module.exports = router;
