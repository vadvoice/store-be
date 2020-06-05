const { isValidObjectId } = require('mongoose');

const isIdValid = async (req, res, next) => {
   const { id } = req.params;
   if (!isValidObjectId(id)) {
      return next({
         message: 'Invalid product id',
         status: 404
      });
   }
   next();
}

module.exports = isIdValid;