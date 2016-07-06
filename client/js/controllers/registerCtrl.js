'use strict';

var app = angular.module('myApp');

app.controller('registerCtrl', function($scope, Auth, $state, $location) {
    console.log('registerCtrl');
    var lat, lng;

    $scope.registerForm = user => {
        var temp;
        if (user) {
            temp = cordinates(user);
            console.log('temp:', temp);
        }
        if ($scope.user.password !== $scope.user.password2) {
            console.log('later');
            $scope.user.password = '';
            $scope.user.password2 = '';
            alert('passwords must match.');
        } else {
            Auth.register(temp)
                .then(res => {
                    Auth.login($scope.user);
                    $state.go('profile');
                })
                .catch(res => {
                    alert(res.data.error);
                });
        }
    };

    function cordinates(user) {
        if(user) {
            Auth.getCordinate(user.address)
                .then(res => {
                    console.log('res.data', res.data);
                     user.lat = res.data.results[0].geometry.location.lat
                     user.lng = res.data.results[0].geometry.location.lng
                })
                .catch(err => {
                    console.log('error while getting cordinates:', err);
                })
        }
        return user;
    }

});
