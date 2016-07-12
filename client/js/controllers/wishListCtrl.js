'use strict';

var app = angular.module('myApp');

app.controller('wishListCtrl', function($scope, Book) {
    console.log('wishListCtrl');
    $scope.search = () => {
        console.log('working');
        if($scope.wish) {
            Book.search($scope.wish.search)
            .then(res => {
                // console.log('search response', res.data);
                $scope.books = res.data.items;
                console.log('books', $scope.books);
            })
            .catch(err => {
                console.log('error while searching books:', err);
            })
        }
    }
})
