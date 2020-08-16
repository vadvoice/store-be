const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProductVoteSchema = new Schema({
   userIds: [String],
   productId: { type: Schema.Types.ObjectId, ref: 'product' },
   voteCount: {
      type: Number,
      default: 0
   },
   createdAt: {
      type: Date,
      default: new Date()
   },
   updatedAt: Date
});

module.exports = model('productVote', ProductVoteSchema);