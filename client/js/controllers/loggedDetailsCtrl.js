'use strict';

var app = angular.module('myApp');

app.controller('loggedDetailsCtrl', function($scope, User, $state, loggedDetails ) {
    console.log('loggedDetailsCtrl');
    $scope.currentDetails = loggedDetails;
    $scope.checkFollowing = () => {
        return $scope.currentDetails.following.length == 0;
    }
    $scope.checkFollower = () => {
        return $scope.currentDetails.followers.length == 0;
    }
});
