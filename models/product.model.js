const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GalleryImage = new Schema({ name: String, url: String, size: Number });

const ProductSchema = new Schema({
  title: String,
  imageUrl: {
    type: String,
    default: ''
  },
  // 0 - available, 1 - processing, 2 - sold out
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  gallery: {
    type: [GalleryImage],
    default: []
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