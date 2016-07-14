'use strict';

var app = angular.module('myApp');

app.controller('bookDetailCtrl', function($scope, Book, $state, detailBook) {
    console.log('bookDetailCtrl');
    $scope.bookDetails = detailBook;
    console.log('lastchance',$scope.bookDetails );
});
