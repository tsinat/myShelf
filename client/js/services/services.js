'use strict';

var app = angular.module('myApp');

app.service('Auth', function($http, $q) {
    this.register = userObj => {
        console.log('userobj:', userObj);
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
    this.getCordinate = address => {
        var street = address.street.split(' ');
        var city = address.city.split(' ');
        console.log('street', street);
        console.log('city:', city);
        return $http.get(`http://maps.google.com/maps/api/geocode/json?address=${street[0]}+${street[1]}+${street[2]},+${city[0]}+${city[1]},+${address.state}&sensor=false`);
    }
});
