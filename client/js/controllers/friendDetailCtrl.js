'use strict';

angular
    .module('myApp')
    .controller('friendDetailCtrl', function($scope, $state, User, friend) {
        $scope.singleUser = friend;

        $scope.flg_unfollow;
        checkIfFollowed($scope.singleUser._id);

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

        function checkIfFollowed(targetId){
            $scope.flg_unfollow = $scope.currentUser.following.some((userId) => {
                return userId == targetId;
            });
        }

    });
