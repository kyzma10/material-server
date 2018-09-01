var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const UserController = require('../controllers/userController');
const StoreController = require('../controllers/storeController');
const AuthController = require('../controllers/authController');
const OrderController = require('../controllers/orderController');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
//
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//   User.findOne({id: jwt_payload.sub}, function(err, user) {
//     if (err) {
//       return done(err, false);
//     }
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//       // or you could create a new account
//     }
//   });
// }));

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
router.post('/api/login', (req, res) => {
  // res.send(req.body);
  const { email, password } = req.body;
  User.findOne({email: email}, (error, user) => {
    if(error) return res.send(500, {message: 'User not found'});
    console.log(password);
    // const pass = req.body.password;
    crypto.DEFAULT_ENCODING = 'hex';
    const key = crypto.pbkdf2Sync(password, 'salt', 100000, 32, 'sha512');
    console.log(key);
    if(key !== user.password) {
      return res.send(401, {message: 'Invalid data'})
    }
      res.send('OK');
    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    //   console.log(token);
      // return res.send(200, {email: email, token: token})

  })
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

router.get('/api/order_list', (req, res) => {
  User.findOne({email: 'test5@com.ua'}, (error, user) => {
    res.send(user.orderList)
  })
});

router.get('/dashboard', OrderController.dashboardPage);

router.get('/contact', (req, res) =>{
  req.flash('success', 'This is a flash message using the express-flash module.');
    res.render('contact', {
      title: 'Contact'
    });
});

module.exports = router;
