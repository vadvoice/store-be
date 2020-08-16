const express = require('express');
const router = express.Router();

const { ProductVoteRepo } = require('../repository');

/**
 * POST vote for the product
 */
router.post('/:productVote', async (req, res, next) => {
   const { params: { productVote }, cookies } = req;
   const userId = cookies['connect.sid'];
   const resolve = await ProductVoteRepo.update(productVote, { ...req.body, userId });
   res.json(resolve);
})

/**
 * DEL delete vote
 */
router.delete('/:productVote', async (req, res, next) => {
   const { productVote } = req.params;
   const resolve = await ProductVoteRepo.delete(productVote);
   res.json(resolve);
})

module.exports = router;
