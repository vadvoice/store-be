require('dotenv').config();

const appConfig = {
  secret: process.env.SECRET,
  origin: process.env.ORIGIN
};

module.exports = appConfig;