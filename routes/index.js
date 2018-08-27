var express = require('express');
var router = express.Router();
const User = require('../models/user');
// import Book from '../models/book';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi my77777 server' });
});

// About page route.
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    });
});

router.get('/users', (req, res) => {
    User.find({}, (err, docs) => {
        if (err) res.json(err);
        else res.render('users', {users: docs});
    });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login'})
    // const user1 = User.find({});
    // const user1 = {email: 'test@com.ua', password: '1q2w3e4r'}
    // res.json(user1);
    // User.find({}, (err, users) => {
    //     if (err) res.json(err);
    //     else res.json(users);
    // })
    // res.json([
    //     {
    //         id: 1,
    //         title: "Alice's Adventures in Wonderland",
    //         author: "Charles Lutwidge Dodgson"
    //     },
    //     {
    //         id: 2,
    //         title: "Einstein's Dreams",
    //         author: "Alan Lightman"
    //     }
    // ])
});

router.post('/login', (req, res) => {
    res.json(req.body)
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register'})
});

router.post('/register', (req, res) => {
    res.json(req.body)
});

router.get('/contact', (req, res) =>{
    res.render('contact', {
        title: 'Contact'
    });
});

router.get('/books', (req, res) => {
    res.json([
        {
            id: 1,
            title: "Alice's Adventures in Wonderland",
            author: "Charles Lutwidge Dodgson"
        },
        {
            id: 2,
            title: "Einstein's Dreams",
            author: "Alan Lightman"
        }
])
});

/*router.get('/find_books', (req, res) => {
        Book.find({}, (err, books) => {
            res.json(books)
        })
    });*/

/*const book = new Book({title: "adam b", author: "book"});
console.log(book);*/


module.exports = router;
