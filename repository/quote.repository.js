const { QuoteModel } = require('../models');

const QuoteRepo = {
   list: async () => {
      const data = await QuoteModel.find();
      return data;
   },
   create: async (data) => {
      return await QuoteModel.create(data);
   },
   delete: async (id) => {
      return await QuoteModel.delete(id);
   }
}

module.exports = QuoteRepo;