const { FeedbackModel } = require('../models');

const StatsRepo = {
   list: async () => {
      const data = await FeedbackModel.find();
      return data;
   },
   collect: async (data) => {
      return await FeedbackModel.create(data);
   }
}

module.exports = StatsRepo;