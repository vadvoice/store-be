const { Schema } = require('mongoose');

const UserAgentSchema = new Schema({
   browser: String,
   version: String,
   os: String,
   platform: String
});

module.exports = {
   UserAgentSchema
}