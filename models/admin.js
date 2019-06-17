'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = Schema({
  username: String,
  password: String,
  lastLoginDate: Date 
})