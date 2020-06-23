const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const StatsDetailsSchema = new Schema({
   range: Array,
   country: String,
   region: String,
   eu: String,
   timezone: String,
   city: String,
   ll: Array,
   metro: Number,
   area: Number
});

const UserAgentSchema = new Schema({
   browser: String,
   version: String,
   os: String,
   platform: String
});

const StatsSchema = new Schema({
   timestamp: Number,
   ip: String,
   stats: StatsDetailsSchema,
   userAgent: UserAgentSchema,
   createdAt: {
      type: Date,
      default: new Date()
   },
});

module.exports = model('stats', StatsSchema);