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
      const user = await UserModel.create(data);
      return user;
   }
}

module.exports = UserRepo;