const { AuthService } = require('../service');

module.exports = async (req, res, next) => {
   const { body, headers, cookies } = req;
   const token = cookies.token || headers['authorization'] || headers['x-access-token'] || body.token;

   if (token) {
      try {
         const decoded = await AuthService.verifyToken(token);
         if (decoded.role !== 'admin') {
            return next({
               status: 403,
               message: 'access denied.'
            });
         }
         next();
      } catch (e) {
         next(e)
      }
   } else {
      return next({
         status: 404,
         message: 'No token provided.'
      });
   }
}