exports.aboutPage = (req, res) => {
    // console.log(req.name);
    // req.flash('error', 'Error');
    // req.flash('info', 'Info');
    // req.flash('success', 'Success');
    res.render('about', {title: 'About'});
};