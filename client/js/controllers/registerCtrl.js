'use strict';

var app = angular.module('myApp');

app.controller('registerCtrl', function($scope, Auth, $state) {
    console.log('registerCtrl');

    $scope.registerForm = user => {
        console.log(user);
        if ($scope.user.password !== $scope.user.password2) {
            $scope.user.password = '';
            $scope.user.password2 = '';
            alert('passwords must match.');
        } else {
            Auth.register($scope.user)
                .then(res => {
                    Auth.login($scope.user);
                    $state.go('profile');
                })
                .catch(res => {
                    alert(res.data.error);
                });
        }
    };
});
