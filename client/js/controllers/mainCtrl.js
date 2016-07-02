'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Auth, User, $state, Upload) {

    $scope.$watch(function() {
        return Auth.currentUser;
    }, function(newVal, oldVal) {
        $scope.currentUser = newVal;
    });

    $scope.logout = () => {
        Auth.logout()
            .then(res => {
                $scope.currentUser = null;
                $state.go('home');
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
                $state.reload();
            })
            .catch(err => {
                console.log('err:', err);
            })
    }
    User.getAll()
        .then(res => {
            $scope.users = res.data;
        })
        .catch(err => {
            console.log(err);
        })
});
