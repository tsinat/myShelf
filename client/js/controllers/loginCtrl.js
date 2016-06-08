'use strict';

var app = angular.module('myApp');

app.controller('loginCtrl', function($scope, Auth, $state) {
    console.log('loginCtrl');
    $scope.loginForm = user => {
        Auth.login($scope.user)
            .then(res => {
                $state.go('profile');
            })
            .catch(res => {
                alert(res.data.error);
            })
    }
});
