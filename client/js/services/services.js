'use strict';

var app = angular.module('myApp');

app.service('Auth', function($http, $q) {
    this.register = userObj => {
        return $http.post('/users/register', userObj);
    };
    this.login = userObj => {
        return $http.post('/users/authenticate', userObj)
            .then(res => {
                // this.currentUser = res.data;
                return this.getProfile();
            });
    };

    this.logout = () => {
        return $http.post('/users/logout')
            .then(res => {
                this.currentUser = null;
                return $q.resolve();
            });
    };
    this.getProfile = () => {
        return $http.get('/users/profile')
            .then(res => {
                console.log(res.data)
                this.currentUser = res.data
                return $q.resolve(res.data);
            })
            .catch(res => {
                this.currentUser = null;
                return $q.reject(res.data);
            });
    };
});
