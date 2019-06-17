'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
  username: String,
  name: String,
  photo: String,
  level: Number,
  introduction: String,
  email: String,
  createDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: Date
})

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfo;