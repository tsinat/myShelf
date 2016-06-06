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
                this.currentUser = res.data
                return $q.resolve(res.data);
            })
            .catch(res => {
                this.currentUser = null;
                return $q.reject(res.data);
            });
    };
    this.editPro = (id, user) => {
        return $http.put(`/users/${id}`, user)
            .then(res => {
                return this.getProfile();
            })
            .catch(err => {
                return $q.reject(err)
            });
    };
});
