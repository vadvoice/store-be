const express = require('express');
const router = express.Router();
const { QuoteRepo } = require('../repository');

/**
 * GET quotes list.
 */
router.get('/', async (req, res, next) => {
   const quotes = await QuoteRepo.list();
   res.json(quotes);
});

router.post('/', async (req, res, next) => {
   const newQuote = await QuoteRepo.create(req.body);
   res.json(newQuote);
});

router.put('/:id', async (req, res, next) => {
   const { id } = req.params;
   const updatedQuote = await QuoteRepo.update(id, req.body);
   res.json(updatedQuote);
});

router.delete('/:id', async (req, res, next) => {
   const { id } = req.params;
   const removedQuote = await QuoteRepo.delete(id);
   res.json(removedQuote);
});

module.exports = router;
