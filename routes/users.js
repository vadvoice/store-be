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
  const userResponse = await UserRepo.create(body);
  if (userResponse.isValid) {
    return res.json(user);
  } else {
    return res.status(404).send(userResponse.message);
  }
});

module.exports = router;
