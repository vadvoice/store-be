const { UserModel } = require('../models');

const UserRepo = {
   list: async () => {
      const data = await UserModel.find();
      return data;
   },
   getUser: async (userEmail) => {
      const user = await UserModel.findOne({
         email: userEmail
      });
      return user;
   },
   isCorrectPassword: async (password) => {
      return await UserModel.isCorrectPassword(password);
   },
   create: async (data) => {
      const { email } = data;
      const existingUser = UserModel.find({ email });
      if (existingUser) {
         return {
            isValid: false,
            message: 'user with this email already exists',
            user: null
         }
      }
      const user = await UserModel.create(data);
      return {
         isValid: true,
         message: 'done',
         user
      };
   }
}

module.exports = UserRepo;