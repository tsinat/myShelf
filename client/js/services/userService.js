'use strict';

var app = angular.module('myApp');

app.service('User', function($http, $q) {
    this.getAll = () => {
        return $http.get('/users')
    }
    this.getOne = id => {
        console.log('id', id);
        return $http.get(`/users/${id}`)
    }
    this.followUnfollow = (currentId, targetId) => {
        console.log('waw:', currentId, targetId);
        return $http.put(`/users/${currentId}/followUnfollow/${targetId}`);
    }
    this.addWishBook = (wishBook, currentUserId) => {
        return $http.post(`/users/addWish/${currentUserId}`, wishBook);
    }
});
