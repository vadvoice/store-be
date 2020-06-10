const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { appConfig } = require('../config');

const ACTIVE_USERS = [];

const verifyToken = async (token) => {
   return jwt.verify(token, appConfig.secret);
};

const verifyRefreshToken = async (token) => {
   return jwt.verify(token, appConfig.refreshTokenSecret);
};

const createToken = async (data) => {
   const userData = {
      id: data._id,
      email: data.email,
      role: data.role
   }

   const token = jwt.sign(
      userData,
      appConfig.secret,
      { expiresIn: appConfig.tokenLife }
   );

   const refreshToken = jwt.sign(
      userData,
      appConfig.refreshTokenSecret,
      { expiresIn: appConfig.refreshTokenLife }
   );

   ACTIVE_USERS.push({
      userId: data._id, token, refreshToken
   })

   return {
      ...userData,
      token,
      refreshToken,
   };
}

const refreshToken = async (data) => {
   const { _id, email, role } = data;

   const detectUser = ACTIVE_USERS.find(storedUser => storedUser.user_id === user_id);

   // if refresh token exists
   if (detectUser) {
      const userData = {
         id: _id,
         email,
         role
      }
      const token = jwt.sign(userData, appConfig.secret, { expiresIn: appConfig.tokenLife });

      return token;
   } else {
      return false;
   }
}

/**
 *
 * @param {String} password password in primary form
 * @returns {String} encrypted string via sha512 algorithm
 */
const encryptPassword = async (password) => {
   const hash = await crypto.pbkdf2Sync(password, appConfig.salt, 10000, 512, 'sha512').toString('hex');
   return hash
};

/**
 *
 * @param {String} password password encrypted via sha512 algorithm
 * @param {String} hash encrypted string for comparison with the passed password
 * @returns {Boolean} comparison result
 */
const validatePassword = async (primaryHash, password) => {
   const hash = await crypto.pbkdf2Sync(password, appConfig.salt, 10000, 512, 'sha512').toString('hex');
   return primaryHash === hash;
}

module.exports = {
   createToken,
   refreshToken,
   encryptPassword,
   validatePassword,
   verifyToken,
   verifyRefreshToken
}