'use strict';

var app = angular.module('myApp');

app.service('Book', function($http, $q) {
    this.create = book => {
        return $http.post('api/books/', book);
    }
});
