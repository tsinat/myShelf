'use strict';

var app = angular.module('myApp');

app.controller('profileCtrl', function($scope, name, $state) {
    $scope.logedUser = name;
})
