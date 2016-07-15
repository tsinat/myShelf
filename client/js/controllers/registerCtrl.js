'use strict';

var app = angular.module('myApp');

app.controller('registerCtrl', function($scope, Auth, $state, $location) {
    console.log('registerCtrl');

    $scope.registerForm = user => {
        if (user.password !== user.password2) {
            $scope.user.password = '';
            $scope.user.password2 = '';
            alert('passwords must match.');
        }
        Auth.getCordinate(user.address)
            .then(res => {
                    user.lat = res.data.results[0].geometry.location.lat
                    user.lng = res.data.results[0].geometry.location.lng
                    Auth.register(user)
                        .then(res => {
                            Auth.login($scope.user)
                                .then(res => {
                                    $state.go('profile.booksFeed');
                                })
                                .catch(err => {
                                    console.log(err);
                                })

                        })
                        .catch(res => {
                            alert(res.data.error);
                        });

            })
            .catch(err => {
                console.log('error while getting cordinates:', err);
            })
    };

});
