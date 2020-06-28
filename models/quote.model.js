const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const QuoteSchema = new Schema({
   text: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: new Date()
   },
});

module.exports = model('quote', QuoteSchema);