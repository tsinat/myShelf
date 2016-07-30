'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const helper = require('sendgrid').mail;


const AWS = require('aws-sdk');


const JWT_SECRET = process.env.JWT_SECRET;

let s3 = new AWS.S3();

let bucketName = process.env.AWS_BUCKET;
let urlBase = process.env.AWS_URL_BASE;

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String
        },
        apt: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        postalcode: {
            type: String
        }
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    wishLists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
});

userSchema.statics.auth = roleRequired => {
    return (req, res, next) => {
        let token = req.cookies.accessToken;

        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) return res.status(401).send({
                error: 'Authentication required.'
            });

            User.findById(payload._id, (err, user) => {
                if (err || !user) return res.status(401).send({
                    error: 'User not found.'
                });
                req.user = user;

                if (roleRequired === 'admin' && !req.user.admin) {
                    return res.status(403).send({
                        error: 'Not authorized.'
                    });
                }

                next(); // they have the required privilages
            }).select('-password');
        });
    };
};

userSchema.statics.isLoggedIn = (req, res, next) => {
    let token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({
            error: 'Authentication required'
        });

        User.findById(payload._id)
            .populate('wishLists')
            .select('-password')
            .exec((err, user) => {
                if (err || !user) return res.status(401).send({
                    error: 'User not found'
                });
                req.user = user;

                next();
            });
    });
};

userSchema.statics.register = (userObj, cb) => {
    console.log('userObj:', userObj);
    User.findOne({
        email: userObj.email
    }, (err, dbUser) => {
        if (err || dbUser) return cb(err || {
            error: 'Email not available.'
        });

        bcrypt.hash(userObj.password, 12, (err, hash) => {
            if (err) return cb(err);

            let user = new User({
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email,
                title: userObj.title,
                about: userObj.about,
                address: userObj.address,
                lat: userObj.lat,
                lng: userObj.lng,
                password: hash
            });

            user.save((err, savedUser) => {
                savedUser.password = null;
                cb(err, savedUser);
            });
        });
    });
};

userSchema.statics.authenticate = (userObj, cb) => {
    User.findOne({
        email: userObj.email
    }, (err, dbUser) => {
        if (err || !dbUser) return cb(err || {
            error: 'Authentication failed. Invalid email or password'
        });

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if (err || !isGood) return cb(err || {
                error: 'Authentication failed. Invalid email or password'
            });

            let token = dbUser.generateToken();
            cb(null, token, dbUser);
        });
    });
};

userSchema.methods.generateToken = function() {
    let payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };
    return jwt.sign(payload, JWT_SECRET);
};

userSchema.statics.edit = (id, passedObj, cb) => {
    User.findByIdAndUpdate(id, {
        $set: passedObj
    }, (err, updatedUser) => {
        if (err) cb(err);

        updatedUser.save((err, savedUser) => {
            cb(err, savedUser);
        });
    });
};

userSchema.statics.addBook = (user, book, cb) => {
    user.books.push(book._id);
    user.save((err, updatedUser) => {
        cb(err, updatedUser)
    });
};
userSchema.statics.deleteBook = (user, bookId, cb) => {
    console.log('books.before', user.books)
    user.books = user.books.filter((dbId) => {
        if (dbId != bookId) {
            return dbId
        }
    });
    user.save((err, updateduser) => {
        console.log('books.after:', updateduser.books);
        cb(err, updateduser);
    });
};

userSchema.statics.addWishBook = (user, book, cb) => {
    user.wishLists.push(book._id);
    user.save((err, addedBook) => {

        cb(err, addedBook)
    });
};

userSchema.statics.followUnfollow = (currentId, targetId, cb) => {
    User.findById(currentId, (err, currentUser) => {
        User.findById(targetId, (err2, targetUser) => {
            if (err || err2) return cb(err || err2);

            let status = currentUser.following.some((userId) => {
                return userId == targetId;
            });
            console.log('status:', status);
            if (status) {
                currentUser.following = currentUser.following.filter((userId) => {
                    if (userId != targetId) {
                        return userId;
                    }
                });
                targetUser.followers = currentUser.followers.filter((userId) => {
                    if (userId != currentId) {
                        return userId;
                    }
                })
            } else {
                currentUser.following.push(targetId);
                targetUser.followers.push(currentId);
            }
            currentUser.save((err, updatedCurrentUser) => {
                targetUser.save((err2, updatedTargetUser) => {
                    if (err || err2) return cb(err || err2);

                    cb(null, updatedCurrentUser);
                });
            });
        });
    });
};

//add image url to the database and upload the image file to aws s3
userSchema.statics.upload = (file, id, cb) => {

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
            image: imgUrl
        }
        User.findByIdAndUpdate(id, {
            $set: passedObj
        }, (err, updatedUser) => {
            if (err) cb(err);
            updatedUser.save((err, savedUser) => {
                if (err) cb(err);
                cb(null, savedUser);
            });
        });
    });
};

userSchema.statics.sendMessage = (messageObj, cb) => {
    let emailReceiver = messageObj.targetUser;
    let emailSubject = messageObj.message.subject;
    let emailContent = messageObj.message.content;

    let from_email = new helper.Email(messageObj.sender);
    let to_email = new helper.Email(emailReceiver);
    let subject = emailSubject;
    let content = new helper.Content("text/html", emailContent);
    let mail = new helper.Mail(from_email, subject, to_email, content);

    let sg = require('sendgrid').SendGrid(process.env.SENDGRID_JMS_API_KEY);
    let requestBody = mail.toJSON();
    let request = sg.emptyRequest();

    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    sg.API(request, (response) => {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

    cb(null);
}

let User = mongoose.model('User', userSchema);

module.exports = User;
