require('dotenv').config();

const appConfig = {
  secret: process.env.SECRET,
  origin: process.env.ORIGIN,
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_ACCOUNT_KEY,
    containerName: process.env.AZURE_BLOB_CONTAINER
  }
};

module.exports = appConfig;