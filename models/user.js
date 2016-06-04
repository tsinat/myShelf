'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    admin: {type: Boolean, default: false },
    password: {type: String, required: true},
    followers: [{
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    }],
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
});

userSchema.statics.auth = roleRequired => {
    return (req, res, next) => {
        var token = req.cookies.accessToken;

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
                    // they don't have admin privilages
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
    // console.log('isLoggedIn:');
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({
            error: 'Authentication required'
        });

        User.findById(payload._id, (err, user) => {
            if (err || !user) return res.status(401).send({
                error: 'User not found'
            });
            req.user = user;
            // console.log(req.user);

            next();
        }).select('-password');
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

            var user = new User({
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email,
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

            var token = dbUser.generateToken();

            cb(null, token, dbUser);
        });
    });
};

userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };
    console.log('JWT_SECRET:', JWT_SECRET);
    return jwt.sign(payload, JWT_SECRET);
};

userSchema.statics.edit = (id, passedObj) => {
    User.findByIdAndUpdate(id, {
        $set: passedObj
    }, (err, updatedUser) => {
        if (err) cb(err);

        updatedUser.save((err, savedUser) => {
            if (err) cb(err);

            cb(null, savedUser);
        });
    });
};

userSchema.statics.addAuction = (user, auction, cb) => {
    user.auctions.push(auction._id);
    user.save((err, addedAuction) => {
        if (err) cb(err)

        cb(null, addedAuction)
    })
}

var User = mongoose.model('User', userSchema);

module.exports = User;
