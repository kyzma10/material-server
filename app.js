const User = require('./models/user');
const passportLocalMongoose = require('passport-local-mongoose');
// const crypto = require('crypto');
const md5 = require('md5');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const LocalStrategy = require('passport-local').Strategy;

const helpers = require('./helpers/helpers');

var session = require('express-session');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // Auth via JWT
const jwt = require('jsonwebtoken'); // auth via JWT for hhtp

var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// app.use(cookieParser('secret'));

// app.use(session({cookie: { maxAge: 60000 }}));
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());


//Set up mongoose connection
var mongoose = require('mongoose');
const mongoDB = require('./config/database');
mongoose.connect(mongoDB.url);
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
// app.use(cookieParser());
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

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    /*res.locals.user = req.user || null;
    res.locals.currentPath = req.path;*/
    next();
});

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
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({email: email}, function (err, user) {
      // console.log('USER AUTH', user);
      if (err) {
        // console.log('UNAUTHORIZATED USER 401!!!!!!!!!');
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

// Expect JWT in the http header

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader(),
  secretOrKey: 'supersecret'
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  })
);

/*User.findOne({email: 'test@com.ua'}, function(error, user){
  if (error) console.log(error);
  const id = user._id;
  console.log(user._id);
  User.update({_id: user._id},{$set: {auth: true}},{multi:true,new:true})
    .then((docs)=>{
      if(docs) {
        resolve({success: true, data: docs});
      } else {
        reject({success:false,data:"no such user exist"});
      }
    }).catch((err)=>{
    reject(err);
  });
  console.log(user)
});*/


// User.update()
/*var token = jwt.sign({email: 'test@com.ua', id: '12qwe334reww3'}, 'supersecret', { expiresIn: 300 })
console.log('!!!!!!!!!!!!MaIN TOKEN111111111::::::::::::', token);

var token1 = jwt.sign({email: 'test@com.ua', id: '12qwe334reww3'}, 'supersecret', { expiresIn: 300 })
console.log('!!!!!!!!!!!!MaIN TOKEN222222222222::::::::::::', token1);
const secret = md5('test2@com.ua');
console.log(secret);*/

module.exports = app;
