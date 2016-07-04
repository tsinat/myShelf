'use strict';

var app = angular.module('myApp');

app.controller('listBooksCtrl', function($scope, $state, User) {
    console.log('listBooksCtrl');
    listAllBooks($scope.currentUser._id);

    function listAllBooks(id) {
        User.getOne(id)
            .then(res => {
                $scope.books = res.data.books;
                console.log(res.data)
            })
            .catch(err => {
                console.log('err while getting all books:', err);
            })
    }
});
