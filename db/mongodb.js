'use strict';

const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('config-lite')({
  filename: 'default',
});

mongoose.connect(config.dbUrl, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log(chalk.green("connect db successfully"))
})

module.exports = db;

