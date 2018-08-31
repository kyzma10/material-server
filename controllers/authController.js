const passport = require('passport');

exports.login = passport.authenticate({
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    res.status(200).redirect('login')
};

exports.confirmEmail = (req, res) => {
    // console.log('Query params', req.parms);
  res.render('confirm_email', {title: 'Confirm Email'})
};