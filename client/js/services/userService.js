'use strict';

var app = angular.module('myApp');

app.service('User', function($http, $q) {
    this.getAll = () => {
        return $http.get('/users')
    }
});
