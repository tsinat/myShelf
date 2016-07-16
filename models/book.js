'use strict';

var mongoose = require('mongoose');
var uuid = require('uuid');

var AWS = require('aws-sdk');


const JWT_SECRET = process.env.JWT_SECRET;

var s3 = new AWS.S3();

var bucketName = process.env.AWS_BUCKET;
var urlBase = process.env.AWS_URL_BASE;

var bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    author: {
        type: String
    },
    authors: [],
    thumbnail: {
        type: String
    },
    googleId: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    cover: {
        type: String
    },
    readit: {
        type:Number, default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        content: {
            type: String
        },
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

bookSchema.statics.getOne = (id, cb) => {
    Book.findById(id, (err, book) => {
        if (err) return cb(err);
        cb(null, book);
    });
};

bookSchema.statics.create = (bookObj, cb) => {
    console.log('book create:', bookObj);
    var book = new Book({
        title: bookObj.title,
        subtitle: bookObj.subtitle,
        author: bookObj.author,
        authors: bookObj.authors,
        thumbnail: bookObj.thumbnail,
        googleId: bookObj.googleId,
        sampleRead:bookObj.sampleRead,
        category: bookObj.category,
        description: bookObj.description,
        status: bookObj.status,
        owner: bookObj.owner
    });
    console.log('book:', book);
    book.save((err, savedBook) => {
        cb(err, savedBook);
    });
};

bookSchema.statics.update = (id, currentBook, cb) => {
    var obj = currentBook;
    Book.findByIdAndUpdate(id, {
        $set: obj
    }, (err, updatedBook) => {
        if (err) cb(err);
        updatedBook.save((err, savedBook) => {
            if (err) cb(err);
            cb(null, savedBook);
        });
    });
};

bookSchema.statics.deleteBook = (id, cb) => {
    Book.findByIdAndRemove(id, (err, deletedBook) => {
        if (err) {
            cb(err)
        } else {
            cb(deletedBook);
        }
    });
};

bookSchema.statics.addComment = (bookId, newComment, cb) => {
    Book.findById(bookId, (err, book) => {
        console.log("book:", book);
        if (err) cb(err);
        var comment = {
            content: newComment.content,
            by: newComment.by
        };
        book.comments.push(comment);
        book.save((err, savedBook) => {
            Book.findById(savedBook._id, (err2, updatedBook) => {
                if (err || err2) cb(err);

                cb(null, updatedBook)
            }).populate('by');
        });
    });
}

//add image url to the database and upload the image file to aws s3
bookSchema.statics.upload = (file, id, cb) => {
    console.log('file:', file);
    console.log('id:', id);

    if (!file.mimetype.match(/image/)) {
        return cb({
            error: 'File must be image.'
        });
    }

    var filenameParts = file.originalname.split('.');

    var ext;
    if (filenameParts.length > 1) {
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
        if (err) return cb(err);

        var imgUrl = `${urlBase}${bucketName}/${key}`;
        var passedObj = {
            cover: imgUrl
        }
        Book.findByIdAndUpdate(id, {
            $set: passedObj
        }, (err, updatedBook) => {
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
