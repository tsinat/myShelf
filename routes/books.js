var express = require('express');
var router = express.Router();

var Book = require('../models/book');
var User = require('../models/user');




router.get('/', (req, res) => {
    Book.find({}, (err, auctions) => {
        if (err) return res.status(400).send(err);
        else res.send(auctions);
    }).populate('owner');
});

router.get('/:id', (req, res) => {
    Book.getOne(req.params.id, (err, auction) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(auction);
        }
    });
});

router.post('/', User.isLoggedIn, (req, res) => {
    Book.create(req.body, (err1, book) => {
        console.log('err', err1)
        if (err1) res.status(400).send(err1)
        else {
            console.log('book created:', book);
            User.addBook(req.user, book, (err2, addedBook) => {
                if (err2) res.status(400).send(err2);
            });
        };
        res.send(book);
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
            res.send(deletedBook);
        }
    });
});

router.put('/:auctionId/addBid/:userId', User.isLoggedIn, (req, res) => {
    Book.highBid(req.params.auctionId, req.params.userId, req.body, (err, hightestBid) => {
        if (err) res.status(400).send(err);
        res.send(hightestBid);
    });
});

module.exports = router;
