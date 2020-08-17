const { QuoteModel } = require('../models');

const QuoteRepo = {
   list: async () => {
      const data = await QuoteModel.find();
      return data;
   },
   create: async (data) => {
      return await QuoteModel.create(data);
   },
   update: async (id, data) => {
      return await QuoteModel.findOneAndUpdate({_id: id}, data);
   },
   delete: async (id) => {
      return await QuoteModel.findOneAndDelete({ _id: id })
   }
}

module.exports = QuoteRepo;