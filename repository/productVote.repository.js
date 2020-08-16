const { ProductVoteModel } = require('../models');

const ProductVoteRepo = {
   update: async (id, data) => {
      return await ProductVoteModel.update({_id: id}, { ...data, $addToSet: { userIds: data.userId } });
   },
   delete: async (id) => {
      return await ProductVoteModel.findOneAndDelete({ _id: id })
   }
}

module.exports = ProductVoteRepo;