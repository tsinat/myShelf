'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Auth, $state, Upload) {

    $scope.$watch(function() {
        return Auth.currentUser;
    }, function(newVal, oldVal) {
        $scope.currentUser = newVal;
    });

    $scope.logout = () => {
        Auth.logout()
            .then(res => {
                $scope.currentUser = null;
                $state.go('login');
            });
    };
    $scope.showadd = false;
    $scope.showForm = () => {
        $scope.user = angular.copy($scope.currentUser);
        $scope.showadd = true;
    }
    $scope.hideForm = () => {
        $scope.showadd = false;
    }
    $scope.editProfile = user => {
        if (user.password !== user.password2) {
            user.password = '';
            user.password2 = '';
            alert('passwords must match.');
        }
        Auth.editPro($scope.currentUser._id, user)
    }
    $scope.submit = () => {
        upload($scope.file, $scope.currentUser._id);
    };

    function upload(file, id) {
        console.log(file, id);
        Upload.upload({
                url: `/api/images/${id}`,
                data: {
                    newFile: file
                },
                method: 'PUT'
            })
            .then(res => {
                console.log('res:', res);
            })
            .catch(err => {
                console.log('err:', err);
            })
    }

});
app.controller('homeCtrl', function($scope) {
    console.log('homeCtrl');

    // $scope.currentUser = 'jim';
});

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

app.controller('profileCtrl', function($scope, name, $state) {
    console.log('profileCtrl');
    $scope.logedUser = name;
})
