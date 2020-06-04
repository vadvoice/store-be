const express = require('express');
const router = express.Router();
const { ProductModel } = require('../models');

/**
 * GET products list.
 */
router.get('/', async (req, res, next) => {
   const products = await ProductModel.find();
   setTimeout(() => {
      // TODO: placeholder
      const products = [
         {
            image: 'https://images.unsplash.com/photo-1479659929431-4342107adfc1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=',
            title: 'Canyons',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
         },
         {
            image: 'https://images.unsplash.com/photo-1479659929431-4342107adfc1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=',
            title: 'asdsafsadf',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
         },
         {
            image: 'https://images.unsplash.com/photo-1479644025832-60dabb8be2a1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=',
            title: 'Trees',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
         },
         {
            image: 'https://images.unsplash.com/photo-1479621051492-5a6f9bd9e51a?dpr=2&auto=compress,format&fit=crop&w=1199&h=811&q=80&cs=tinysrgb&crop=',
            title: 'Lakes',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
         },
      ]
      res.json(products);
   }, 2000)
});

/**
 * POST craete product
 */
router.post('/', async (req, res, next) => {
   const { body } = req;
   const product = await ProductModel.create(body);
   res.json(product);
});

module.exports = router;
