'use strict';

var mongoose = require('mongoose');
var uuid = require('uuid');

var AWS = require('aws-sdk');


const JWT_SECRET = process.env.JWT_SECRET;

var s3 = new AWS.S3();

var bucketName = process.env.AWS_BUCKET;
var urlBase = process.env.AWS_URL_BASE;

var bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String},
    cover: { type: String},
    category: {type: String, required: true},
    review: { type: String, required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likes: {type: Number, default: 0},
    comments: [{
        content: {type: String},
        by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
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
        title: bookObj.title,
        author: bookObj.author,
        category: bookObj.category,
        review: bookObj.review,
        owner: bookObj.owner
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

//add image url to the database and upload the image file to aws s3
bookSchema.statics.upload = (file, id, cb) => {
  console.log('file:', file);
  console.log('id:', id);
  
  if(!file.mimetype.match(/image/)) {
    return cb({error: 'File must be image.'});
  }

  var filenameParts = file.originalname.split('.');

  var ext;
  if(filenameParts.length > 1) {
    ext = '.' + filenameParts.pop();
  } else {
    ext = '';
  }

  var key = uuid() + `${ext}`;
  var params = {
    Bucket: bucketName,
    Key: key,
    ACL: 'public-read',
    Body: file.buffer
  };

  s3.putObject(params, (err, result) => {
    if(err) return cb(err);

    var imgUrl = `${urlBase}${bucketName}/${key}`;
    var passedObj = {
        cover: imgUrl
    }
    Book.findByIdAndUpdate(id, {$set: passedObj}, (err, updatedBook) => {
        if (err) cb(err);
        updatedBook.save((err, savedBook) => {
            if (err) cb(err);
            cb(null, savedBook);
        });
    });

  });
};

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
