'use strict';

var app = angular
    .module('myApp')
    .controller('friendDetailCtrl', function($scope, $state, User, friend, ModalService) {
        $scope.singleUser = friend;

        $scope.flg_unfollow;
        checkIfFollowed($scope.singleUser._id);

        $scope.showIfNotUser = (id) => {
            return !($scope.currentUser._id == id);
        };
        $scope.follow = (currentId, targetId) => {
            User.followUnfollow(currentId, targetId)
                .then(res => {
                    $state.reload();
                })
                .catch(err => {
                    console.log('error while following user', err);
                })
        };
        $scope.unfollow = (currentId, targetId) => {
            User.followUnfollow(currentId, targetId)
                .then(res => {
                    $state.reload();
                })
                .catch(err => {
                    console.log('error while following user', err);
                })
        };

        function checkIfFollowed(targetId) {
            $scope.flg_unfollow = $scope.currentUser.following.some((userId) => {
                return userId == targetId;
            });
        }
        $scope.modalShown = false;
        $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };
        $scope.sendPrivateMessage = (targetUser, message) => {
            console.log('will send private message', targetUser);
            console.log('message:', message);
            User.sendMessage($scope.currentUser, targetUser, message)
                .then(res => {
                    console.log('message after sending message');
                })
                .catch(err => {
                    console.log('error while sending message', err);
                })
        }
    });
app.directive('modalDialog', function() {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function() {
                scope.show = false;
            };
        },
        template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
    };
});
