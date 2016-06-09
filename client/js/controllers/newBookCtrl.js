'use strict';

var app = angular.module('myApp');

app.controller('newBookCtrl', function($scope, $state, Upload, Book) {
    console.log('newBookCtrl');
    $scope.addBook = book => {
        console.log('currentUser',book);
        var newBook = {
            title: book.title,
            author: book.author,
            category: book.category,
            review: book.review,
            owner: $scope.currentUser._id
        }
        Book.create(newBook)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    $scope.bookCover = () => {
        upload($scope.file, $scope.currentUser._id);
    };

    function upload(file, id) {
        console.log(file, id);
        Upload.upload({
                url: `/api/images/b/${id}`,
                data: {
                    newFile: file
                },
                method: 'PUT'
            })
            .then(res => {
                console.log('res:', res);
            })
            .catch(err => {
                console.log('err:', err);
            })
    }
});
