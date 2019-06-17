'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: {type: String, required: true},
  date: Date,
  folderName: {type: String, default: ""},
  complete: {type: Boolean, default: false},
  username: {type: String, required: true}
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;