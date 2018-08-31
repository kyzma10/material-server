const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const md5 = require('md5');
const passport = require('passport');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const crypto = require('crypto');

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    auth: {
      type: Boolean,
      default: false
    },

    orderList: {
        type: Array
    }
});

userSchema.methods.verifyPassword = function verifyPassword(password) {
  crypto.DEFAULT_ENCODING = 'hex';
  const key = crypto.pbkdf2Sync(password, 'salt', 100000, 32, 'sha512');

  if(this.password === key) {
    return true
  }

  return false;
};


userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);