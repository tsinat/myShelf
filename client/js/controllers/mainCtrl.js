'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Auth, User, $state, Upload, $location) {
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
            .then(res => {
                // console.log(res.data);
                $location.path('/profile/listBooks');
            })
            .catch(err => {
                console.log('error while updating profile', err);
            })
    }
    $scope.submit = () => {
        upload($scope.file, $scope.currentUser._id);
    };

    function upload(file, id) {
        // console.log(file, id);
        Upload.upload({
                url: `/api/images/${id}`,
                data: {
                    newFile: file
                },
                method: 'PUT'
            })
            .then(res => {
                // console.log('res:', res);
                $location.path('/profile/listBooks');
                $state.reload();
            })
            .catch(err => {
                console.log('err:', err);
            })
    }
    User.getAll()
        .then(res => {
            var temp = res.data;
            // console.log('temp:', temp);
            $scope.users = temp.map(function(user) {
                if (user.lat) {
                    // if ($scope.currentUser.address.city == user.address.city) {

                        var R = 6371;
                        var dLat = deg2rad($scope.currentUser.lat - user.lat); //
                        var dLon = deg2rad($scope.currentUser.lng - user.lng);
                        var a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(deg2rad(user.lat)) * Math.cos(deg2rad($scope.currentUser.lat)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        var d = R * c; // Distance in km

                        function deg2rad(deg) {
                            return deg * (Math.PI / 180)
                        }
                        user.distance = d.toFixed(0) + ' Kilometers';
                        return user;
                    // }
                } else {
                    return user;
                }
            });
        })
        .catch(err => {
            console.log(err);
        })

        $scope.showIfNotUser = (id) => {
            return ! ($scope.currentUser._id == id);
        };

        //follow and unfollow in the user finder
        $scope.flg_unfollow;
        $scope.checkIfFollowed = (id) => {
             return checkFollowed(id);
        };

        $scope.showIfNotUser = (id) => {
            return ! ($scope.currentUser._id == id);
        };
        $scope.follow = (currentId, targetId) => {
            User.followUnfollow(currentId, targetId)
                .then(res => {
                    // console.log('response after following user', res);
                    $state.reload();
                })
                .catch(err => {
                    console.log('error while following user', err);
                })
        };
        $scope.unfollow = (currentId, targetId) => {
            User.followUnfollow(currentId, targetId)
                .then(res => {
                    // console.log('response after following user', res);
                    $state.reload();
                })
                .catch(err => {
                    console.log('error while following user', err);
                })
        };

        function checkFollowed(targetId){
            $scope.flg_unfollow = $scope.currentUser.following.some((userId) => {
                return userId == targetId;
            });
            return $scope.flg_unfollow;
        }
});
