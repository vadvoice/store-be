const { StatsModel } = require('../models');

const StatsRepo = {
   list: async () => {
      const data = await StatsModel.find();
      return data;
   },
   collect: async (data) => {
      return await StatsModel.create(data);
   }
}

module.exports = StatsRepo;