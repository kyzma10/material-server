var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const UserController = require('../controllers/userController');
const StoreController = require('../controllers/storeController');
const AuthController = require('../controllers/authController');
const OrderController = require('../controllers/orderController');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

router.get('/', function(req, res) {
  res.render('index', { title: 'Hi my77777 server' });
});

router.get('/about', StoreController.aboutPage);

router.get('/users', (req, res) => {
    User.find({}, (err, docs) => {
        if (err) res.json(err);
        else res.render('users', {users: docs});
    });
});

router.get('/login', UserController.loginForm);

router.post('/login', passport.authenticate('local', {session: false}), function(req, res) {
  res.redirect('/dashboard');
});

router.get('/register', UserController.registerForm);
router.get('/api/register', UserController.registerForm);

router.post('/register', UserController.register);
router.post('/api/register', UserController.apiRegister);

router.get('/logout', AuthController.logout);
router.get('/api/logout', AuthController.logout);

router.get('/confirm_email', AuthController.confirmEmail);
router.get('/api/confirm_email', (req, res) => {
  res.send('get confirm');
});

router.post('/api/confirm_email', UserController.apiConfirmEmail);

router.get('/dashboard', OrderController.dashboardPage);

router.get('/contact', (req, res) =>{
  req.flash('success', 'This is a flash message using the express-flash module.');
    res.render('contact', {
      title: 'Contact'
    });
});

router.get('/example/a', function (req, res) {
  res.send('Hello from A!');
});

module.exports = router;
