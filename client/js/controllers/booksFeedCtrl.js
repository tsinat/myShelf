'use strict';

var app = angular.module('myApp');

app.controller('booksFeedCtrl', function($scope, Book, $state, booksFeed) {
    console.log('booksFeedCtrl');
    $scope.booksFeed = booksFeed.reverse();

    $scope.addComment = (comment, bookId) => {
        console.log('comment:', comment)
        if(comment != undefined) {
            let newComment = {
                content: comment,
                by: $scope.currentUser._id
            }
            Book.addNewComment(newComment, bookId)
                .then(res => {
                    $state.reload();
                    console.log('response after saving comment', res.data);
                })
                .catch(err => {
                    console.log('error while saving comment:', err);
                })
        }
    }
})
