'use strict';

var app = angular.module('myApp');

app.controller('booksFeedCtrl', function($scope, Book, $state, booksFeed) {
    console.log('booksFeedCtrl');
    $scope.booksFeed = booksFeed.reverse();

    $scope.addComment = (comment, bookId) => {
        console.log('comment', comment);
        let newComment = {
            content: comment,
            by: $scope.currentUser._id
        }
        Book.addNewComment(newComment, bookId)
            .then(res => {
                console.log('response after saving comment', res.data);
                // $state.reload();
            })
            .catch(err => {
                console.log('error while saving comment:', err);
            })
    }
})
