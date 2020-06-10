require('dotenv').config();

const appConfig = {
  secret: process.env.SECRET,
  origin: process.env.ORIGIN,
  tokenLife: process.env.TOKEN_LIFE,
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  salt: process.env.SALT,
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_ACCOUNT_KEY,
    containerName: process.env.AZURE_BLOB_CONTAINER
  }
};

module.exports = appConfig;