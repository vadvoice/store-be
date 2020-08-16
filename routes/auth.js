const express = require('express');
const router = express.Router();
const { UserRepo } = require('../repository');
const { AuthService } = require('../service');

/**
 * GET login.
 */
router.post('/login', async (req, res, next) => {
   const { email, password } = req.body;
   const foundUser = await UserRepo.getUser(email);
   if (foundUser) {
      const isPassCorrect = await foundUser.isCorrectPassword(password);
      if (!isPassCorrect) {
         return next({
            status: 404,
            message: 'Incorrect request. P'
          }) 
      }
      const tokenData = await AuthService.createToken(foundUser);
      res.cookie('token', tokenData.token);
      res.cookie('refreshToken', tokenData.refreshToken);

      return res.json(tokenData);
   } else {
      return next({
         status: 404,
         message: 'Incorrect request.'
       })
   }
});

   /**
 * GET user data.
 */
router.get('/user', async (req, res, next) => {
   const userId = req.cookies['connect.sid'];
   return res.json({ userId });
});

module.exports = router;
