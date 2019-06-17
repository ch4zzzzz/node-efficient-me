const session = require('express-session')
const cookieParser = require('cookie-parser')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const chalk = require('chalk');
const fs = require('fs')
const https = require('https')
const router = require('./routers/router.js');
const history = require('connect-history-api-fallback');
const config = require('config-lite')({
  filename: 'default',
});

const db = require('./db/mongodb.js');
const MongoStore = require('connect-mongo')(session);

const privateKey  = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
const credentials = {key: privateKey, cert: certificate};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(history());

app.use(cookieParser());
app.use(session({
  ...config.session,
  store: new MongoStore({mongooseConnection: db})
}))


app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// https.createServer({
//   credentials
// }, app)
// .listen(3000, function () {
//   console.log('Example app listening on port 3000! Go to https://localhost:3000/')
// })
app.listen(config.port, () => console.log(chalk.green(`Example app listening on port ${config.port}!`)))

module.exports = app;
