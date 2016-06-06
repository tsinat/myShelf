'use strict';

var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    description: {type: String, required: true},
    cover: {type: String, required: true, required:true},
    category: {type: String, required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    highestBid: [{
        value: {type: Number},
        bider: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }]
});

bookSchema.statics.getOne = (id, cb) => {
    Book.findById(id, (err, book) => {
        if(err) return cb(err);
        cb(null, book);
    });
};

bookSchema.statics.create = (bookObj, cb) => {
    console.log('book create:', bookObj);
    var book = new Book({
        description: bookObj.description,
        image: bookObj.image,
        endTime: bookObj.endTime,
        category: bookObj.category,
        owner: bookObj.owner,
        initialBid: bookObj.initialBid,
    });
    book.save((err, savedBook) => {
        if(err) return cb(err);

        else cb(null, savedBook);
    });
};

bookSchema.statics.update = (id, currentBook, cb) => {
    var obj = currentBook;
    Book.findByIdAndUpdate(id, { $set: obj}, (err, updatedBook) => {
        if(err) cb(err);
        updatedBook.save((err, savedBook) => {
            if(err) cb(err);
            cb(null, savedBook);
        });
    });
};

bookSchema.statics.deleteBook = (id, cb) => {
    Book.findByIdAndRemove(id, (err, deletedBook) => {
        if(err){
            cb(err)
        }
        else {
            cb(deletedBook);
        }
    });
};

bookSchema.statics.highBid = (bookId, userId, bid, cb) => {
    Book.findById(bookId, (err, book) => {
        console.log("book:", book);
        if(err) cb(err);
        var obj = {
            value: Number(bid.value),
            bider: bid.bider
        };
        book.highestBid.push(obj);
        book.save((err, savedBid) => {
            if(err) cb(err);

            cb(null , savedBid)
        });
    });
}
var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
