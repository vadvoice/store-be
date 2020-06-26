const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { UserAgentSchema } = require('./common');

const FeedbackSchema = new Schema({
   rate: Number,
   comment: String,
   userAgent: UserAgentSchema,
   createdAt: {
      type: Date,
      default: new Date()
   },
});

module.exports = model('feedback', FeedbackSchema);