const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
  title: String,
  imageUrl: {
    type: String,
    default: ''
  },
  blobName: String,
  description: String,
  amount: Number,
  currency: {
    type: String,
    default: 'usd'
  },
  createdAt: {
     type: Date,
     default: new Date()
  },
  updatedAt: Date
});

module.exports = model('product', ProductSchema);