const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema, model } = mongoose;

const saltRounds = 10;

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

UserSchema.pre('save', function (next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRounds,
      function(err, hashedPassword) {
      if (err) {
        next(err);
      }
      else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = model('user', UserSchema);