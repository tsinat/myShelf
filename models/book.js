'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

const AWS = require('aws-sdk');


const JWT_SECRET = process.env.JWT_SECRET;

let s3 = new AWS.S3();

let bucketName = process.env.AWS_BUCKET;
let urlBase = process.env.AWS_URL_BASE;

let bookSchema = new mongoose.Schema({
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
    sampleRead: {
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
    upvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    readit: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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
        },
        createdAt: {
            type: Date, default: Date.now()
        }
    }]
});

// bookSchema.statics.getOne = (id, cb) => {
//     Book.findById(id, (err, book) => {
//         if (err) return cb(err);
//         cb(null, book);
//     });
// };

bookSchema.statics.create = (bookObj, cb) => {
    console.log('book create:', bookObj);
    let book = new Book({
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
    let obj = currentBook;
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
    console.log('deleting one book:', id);
    Book.findByIdAndRemove(id, (err, deletedBook) => {
        if (err) {
            cb(err)
        } else {
            cb(null, deletedBook);
        }
    });
};

bookSchema.statics.addComment = (bookId, newComment, cb) => {
    Book.findById(bookId, (err, book) => {
        console.log("book:", book);
        if (err) cb(err);
        let comment = {
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

bookSchema.statics.readIt = (bookId, userId, cb) => {
    console.log('userId', userId);
    console.log(typeof userId);
    Book.findById(bookId, (err, dbBook) => {
        if(err) return cb(err);

        if(dbBook.readit.indexOf(userId) == -1) {
            dbBook.readit.push(userId);
        } else {
            dbBook.readit = dbBook.readit.filter((id) => {
                if(id != userId) {
                    return id;
                }
            });
        }
        console.log('readit2', dbBook.readit);
        dbBook.save((err2, updatedBook) => {
            console.log('updatedBook:', updatedBook);
            if(err2) return cb(err2);

            cb(null, updatedBook);
        });
    });
};

bookSchema.statics.upVote = (bookId, userId, cb) => {
    Book.findById(bookId, (err, dbBook) => {
        if(err) return cb(err);

        if(dbBook.upvote.indexOf(userId) == -1) {
            if(dbBook.downvote.indexOf(userId) == -1) {
                dbBook.upvote.push(userId);
            } else {
                dbBook.downvote = dbBook.downvote.filter((id) => {
                    if(id != userId) {
                        return id;
                    }
                })
            }
        } else {
            dbBook.upvote = dbBook.upvote.filter((id) => {
                if(id != userId) {
                    return id;
                }
            })
        }
        dbBook.save((err, updatedBook) => {
            cb(null, updatedBook);
        });
    });
};
bookSchema.statics.downVote = (bookId, userId, cb) => {
    Book.findById(bookId, (err, dbBook) => {
        if(err) return cb(err);

        if(dbBook.downvote.indexOf(userId) == -1) {
            if(dbBook.upvote.indexOf(userId) == -1) {
                dbBook.downvote.push(userId);
            } else {
                dbBook.upvote = dbBook.upvote.filter((id) => {
                    if(id != userId) {
                        return id;
                    }
                });
            }
        } else {
            dbBook.downvote = dbBook.downvote.filter((id) => {
                if(id != userId) {
                    return id;
                }
            })
        }
        dbBook.save((err, updatedBook) => {
            cb(null, updatedBook);
        });
    });
};

//add image url to the database and upload the image file to aws s3
bookSchema.statics.upload = (file, id, cb) => {
    console.log('file:', file);
    console.log('id:', id);

    if (!file.mimetype.match(/image/)) {
        return cb({
            error: 'File must be image.'
        });
    }

    let filenameParts = file.originalname.split('.');

    let ext;
    if (filenameParts.length > 1) {
        ext = '.' + filenameParts.pop();
    } else {
        ext = '';
    }

    let key = uuid() + `${ext}`;
    let params = {
        Bucket: bucketName,
        Key: key,
        ACL: 'public-read',
        Body: file.buffer
    };

    s3.putObject(params, (err, result) => {
        if (err) return cb(err);

        let imgUrl = `${urlBase}${bucketName}/${key}`;
        let passedObj = {
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

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;
