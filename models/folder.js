'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const folderSchema = Schema({
  folderName: {type: String, required: true},
  username: {type: String, required: true}
})

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;