'use strict';

module.exports = {
  port: 3000,
  dbUrl: 'mongodb://localhost:27017/efficient-me',
  session: {
    secret: 's3Cur3',
    name: 'sessionId',
    resave: true,
    saveUninitialized: false,
  }
}