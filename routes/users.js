const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');

/**
 * GET users list.
 */
router.get('/', async (req, res, next) => {
  const users = await UserModel.find();
  res.json(users);
});

/**
 * POST craete user
 */
router.post('/', async (req, res, next) => {
  const { body } = req;
  const user = await UserModel.create(body);
  res.json(user);
});

module.exports = router;
