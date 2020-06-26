const express = require('express');
const { FeedbackRepo } = require('../repository');
const router = express.Router();
const useragent = require('express-useragent');

/**
 * GET list of feedbacks
 */
router.get('/', async (req, res, next) => {
   const feedbacks = await FeedbackRepo.list();
   res.json(feedbacks);
})

/**
 * POST leave feedback
 */
router.post('/', async (req, res, next) => {
   const source = req.headers['user-agent'];
   // const { browser, version, os, platform } = useragent.parse(source);
   const storedFeedback = await FeedbackRepo.collect({
      ...req.body,
      userAgent: useragent.parse(source)
   })
   res.json(storedFeedback);
})

module.exports = router;
