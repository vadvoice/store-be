const { appConfig } = require('../config');
const stripe = require('stripe')(appConfig.stripe.stripeKey);

module.exports = stripe;

