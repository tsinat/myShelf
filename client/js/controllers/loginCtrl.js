'use strict';

var app = angular.module('myApp');

app.controller('loginCtrl', function($scope, Auth, $state, $location) {
    console.log('loginCtrl');
    $scope.loginForm = user => {
        console.log('user', user);
        Auth.login($scope.user)
            .then(res => {
                // $state.go('profile.listBooks');
                $location.path('/profile/listBooks');

            })
            .catch(res => {
                alert(res.data.error);
            })
    }
});
