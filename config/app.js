require('dotenv').config();

const appConfig = {
  secret: process.env.SECRET,
  origin: process.env.ORIGIN,
  tokenLife: process.env.TOKEN_LIFE,
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  salt: process.env.SALT,
  stripe: {
    stripeKey: process.env.STRIPE_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL
  },
  azure: {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_ACCOUNT_KEY,
    containerName: process.env.AZURE_BLOB_CONTAINER
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

module.exports = appConfig;