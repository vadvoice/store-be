const express = require('express');
const router = express.Router();

const { ProductRepo } = require('../repository');
const { isIdValid, uploadFile, isTokenExists, isAdmin } = require('../middlewares');

const uploadStrategy = uploadFile('image');

//TODO: protect routes with TOKEN checker

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
      const { body, file } = req;
      let data = { ...body }
      if (file) {
         data.file = file;
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
   const { body, file, params: { id } } = req;
   try {
      let productData = { ...body };
      if (file) {
        productData.file = file;
      }
      const product = await ProductRepo.update(id, productData);
      res.json(product);
   } catch(e) {
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
      res.json(removedProduct);
   } catch(e) {
      next(e);
   }
});

module.exports = router;
