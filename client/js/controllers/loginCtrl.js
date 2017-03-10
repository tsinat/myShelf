'use strict';

var app = angular.module('myApp');

app.controller('loginCtrl', function($scope, Auth, $state, $location, $timeout) {
    $scope.loginForm = user => {
        console.log('user', user);
        Auth.login($scope.user)
            .then(res => {
                $timeout(function() {
                    $state.go('profile');
                }, 1000);

            })
            .catch(res => {
                alert(res.data.error);
            })
    }
});

app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      $elm.on('click', function() {
        $("body").animate({scrollTop: $elm.offset().top}, "slow");
      });
    }
  }
});
