'use strict';

var app = angular.module('myApp');

app.controller('booksFeedCtrl', function($scope, Book, booksFeed) {
    console.log('booksFeedCtrl');
    $scope.booksFeed = booksFeed.reverse();
})
