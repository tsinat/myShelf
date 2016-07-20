var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');




router.get('/', (req, res) => {
    Book.find({})
        .populate('owner')
        .populate('comments.by')
        .exec((err, books) => {
        if (err) return res.status(400).send(err);
        else res.send(books);
    });
});

router.get('/:id', (req, res) => {
    console.log('getting single book', req.params.id);
    Book.findById(req.params.id)
        .populate('owner')
        .populate('comments.by')
        .exec((err, book) => {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log('singlebook:', book);
            res.send(book);
        }
    });
});

router.post('/', User.isLoggedIn, (req, res) => {
    Book.create(req.body, (err1, book) => {
        if (err1) res.status(400).send(err1)
        else {
            User.addBook(req.user, book, (err2, addedBook) => {
                if (err2) res.status(400).send(err2);

                res.send();
            });
        };
    });
});
router.post('/wishList', User.isLoggedIn, (req, res) => {
    Book.create(req.body, (err1, book) => {
        if (err1) res.status(400).send(err1)
        else {
            User.addWishBook(req.user, book, (err2, addedBook) => {
                if (err2) res.status(400).send(err2);

                res.send();
            });
        };
    });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
    Book.update(req.params.id, req.body, (err, updatedBook) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(updatedBook);
        }
    });
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
    Book.deleteBook(req.params.id, (err, deletedBook) => {
        if (err) {
            res.status(400).send(err);
        } else {
            User.deleteBook(req.user, req.params.id, (err2, addedBook) => {
                if (err2) res.status(400).send(err2);

                res.send();
            });
            // res.send(deletedBook);
        }
    });
});

router.put('/addComment/:bookId', User.isLoggedIn, (req, res) => {
    Book.addComment(req.params.bookId, req.body, (err, updatedBook) => {
        if (err) res.status(400).send(err);
        res.send(updatedBook);
    });
});

router.put('/:bookId/readIt/:userId', (req, res) => {
    Book.readIt(req.params.bookId, req.params.userId, (err, updatedBook) => {
        console.log('error while saving readit', err);
        res.status(err ? 400: 200).send(err || updatedBook);
    })
})
module.exports = router;
