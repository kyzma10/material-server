// import Book from './models/book';
const User = require('./models/user');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
const mongoDB = 'mongodb://admin:123456s@ds229722.mlab.com:29722/db_material';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('We Are Connected')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users.jade', usersRouter);

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

/*const book = new Book({title: "adam b", author: "book"});
console.log(book);*/


/*create new user in data base*/
/*const user = new User({email: 'test2@com.ua', password: '0008888'});
console.log('user', user);

user.save((err, user) => {
    if (err) {
        console.log('err', err)
    }
    console.log('saved user', user)
});*/

/*finding user from database*/
/*User.findById('5b7e7e58e1e70219d2cc810a', (err, user) => {
    console.log('result', err, user)
});*/

/*User.findOne({email: "test@com.ua"}, (err, user) => {
  console.log('result', err, user);
});*/

module.exports = app;
