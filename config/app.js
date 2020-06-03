require('dotenv').config();

const appConfig = {
  secret: process.env.SECRET,
};

module.exports = appConfig;