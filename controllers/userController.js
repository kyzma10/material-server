const mongoose = require('mongoose');
const dump = require('../helpers/helpers');
const User = require('../models/user');
const crypto = require('crypto');
const createError = require('http-errors');
const promisify = require('es6-promisify');
const passport = require('passport');
const md5 = require('md5');


exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login'})
};

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Register'})
};

exports.validateRegister = (req, res, next) => {
    req.checkBody('email', 'That Email is not valid!').isEmail();
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('confirm_password', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('confirm_password', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        // dump(errors);
        // console.log(errors);
        // res.json(errors);
        // req.flash('error', errors.map(err => err.msg));
        // res.render('register', { title: 'Register', body: req.body });
        // return;
    }
    next();
};

exports.register = async (req, res, next) => {
  // console.log('registering user');
  crypto.DEFAULT_ENCODING = 'hex';
  const key = crypto.pbkdf2Sync(req.body.password, 'salt', 100000, 32, 'sha512');
  User.register(new User({email: req.body.email, password: key}), key, function(err) {
    if (err) {
      // console.log('error while user register!', err);
      return next(err);
    }

    // console.log('user registered!');
    res.redirect('confirm_email');
    // passport.authenticate('local', (req, res) => {res.redirect('confirm_email');})
  });
};

exports.apiRegister = async (req, res, next) => {
  crypto.DEFAULT_ENCODING = 'hex';
  const key = crypto.pbkdf2Sync(req.body.password, 'salt', 100000, 32, 'sha512');
  User.register(new User({email: req.body.email, password: key}), key, function(err) {
    if (err) {
      // console.log('error while user register!', err);
      return res.status(301).send(err)
    }

    // console.log('user registered!');
    const confirmCode = md5(req.body.email);
    res.send({email: req.body.email, confirm_code: confirmCode});
    // passport.authenticate('local', (req, res) => {res.redirect('confirm_email');})
  });
};

exports.apiConfirmEmail = async (req, res) => {
  User.findOne({email: req.body.email}, (error, user) => {
    if(error){
      return res.status(301).send(error)
    } else {
      const confirmRequest = md5(req.body.email);
      const confirmUserEmail = md5(user.email);

      if(confirmRequest !== confirmUserEmail && req.body.verify_code !== confirmUserEmail){
        return res.status(301).send(error)
      }

      User.update({_id: user._id}, {$set: {auth: true}}, {multi: true, new: true})
        .then((docs)=>{
          if(docs) {
            resolve({success: true, data: docs});
          } else {
            reject({success: false, data: "no such user exist"});
          }
        }).catch((err)=>{
        reject(err);
      });

      return res.send(user);
    }


  });
};
