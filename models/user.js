'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  U_token: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;