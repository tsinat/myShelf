'use strict';

angular
    .module('myApp')
    .controller('friendDetailCtrl', function($scope, User, friend) {
        $scope.singleUser = friend;
        console.log('detail:', friend)
    })
