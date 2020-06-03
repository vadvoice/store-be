require('dotenv').config();

const databaseConfig = {
  mongoUri: process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
  filesCollection: process.env.FILES_COLLECTION,
};

module.exports = databaseConfig;