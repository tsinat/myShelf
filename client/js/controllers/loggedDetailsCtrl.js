'use strict';

var app = angular.module('myApp');

app.controller('loggedDetailsCtrl', function($scope, User, $state, loggedDetails ) {
    console.log('loggedDetailsCtrl');
    $scope.currentDetails = loggedDetails;
});
