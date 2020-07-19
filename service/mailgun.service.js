const mailgun = require("mailgun-js");
const { appConfig} = require("../config");
const mg = mailgun({ apiKey: appConfig.mailgun.apiKey, domain: appConfig.mailgun.domain, host: 'api.eu.mailgun.net' });

module.exports = mg;