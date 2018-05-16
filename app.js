var createError = require('http-errors');
var express = require('express');
var fs = require('fs')
var path = require('path');
var logger = require('morgan');

/** router setting */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {flags: 'a'})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//logger('[method]:method [usr]:url [status]:status :res[content-length] - [time]:response-time ms');
//app.use(logger('dev', {stream: accessLogStream}));
app.use(logger('[method]:method [url]:url [status]:status :res[content-length] - [time]:response-time ms', {stream: accessLogStream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// request router mapping
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
