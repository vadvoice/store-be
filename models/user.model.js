const mongoose = require('mongoose');
const { encryptPassword, validatePassword } = require('../service/auth.service');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  date: String,
  description: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    id: { type: String },
    originalname: { type: String },
    filename: { type: String },
    size: { type: Number }
  },
  role: {
    type: String,
    enum: ['user', 'tester', 'admin'],
    default: 'user'
  }
});

UserSchema.pre('save', async function (next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    document.password = await encryptPassword(document.password);
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = async function (password) {
  return await validatePassword(this.password, password);
}

module.exports = model('user', UserSchema);