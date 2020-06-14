const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  title: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'product' }],
  comment: String,
  from: String,
  email: {
   type: String,
   required: true
  },
  amount: {
     type: Number,
     required: true
  },
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

module.exports = model('order', OrderSchema);