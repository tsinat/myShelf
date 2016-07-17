'use strict';

var app = angular.module('myApp');

app.controller('loginCtrl', function($scope, Auth, $state, $location, $timeout) {
    console.log('loginCtrl');
    $scope.loginForm = user => {
        console.log('user', user);
        Auth.login($scope.user)
            .then(res => {
                $timeout(function() {
                    $state.go('profile');
                }, 1000);
                // $location.path('/profile/booksFeed');

            })
            .catch(res => {
                alert(res.data.error);
            })
    }
});
