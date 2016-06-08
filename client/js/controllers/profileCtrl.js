'use strict';

var app = angular.module('myApp');

app.controller('profileCtrl', function($scope, name, $state) {
    console.log('profileCtrl');
    $scope.logedUser = name;
})
