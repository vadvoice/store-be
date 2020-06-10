const express = require('express');
const router = express.Router();
const { UserRepo } = require('../repository');

/**
 * GET users list.
 */
router.get('/', async (req, res, next) => {
  const users = UserRepo.list();
  res.json(users);
});

/**
 * POST craete user
 */
router.post('/', async (req, res, next) => {
  const { body } = req;
  const user = await UserRepo.create(body);
  res.json(user);
});

module.exports = router;
