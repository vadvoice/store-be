const express = require('express');
const router = express.Router();
const { isTokenExists, isAdmin } = require('../middlewares');

/**
 * GET check admin permission.
 */
router.get('/isAdmin', isTokenExists, isAdmin, async (req, res, next) => {
  res.json(true);
});


module.exports = router;
