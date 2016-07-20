'use strict';

var app = angular.module('myApp');

app.controller('booksFeedCtrl', function($scope, Book, $state, booksFeed) {
    console.log('booksFeedCtrl');
    $scope.booksFeed = booksFeed.reverse();

    $scope.checkIfUpVoted = (book) => {
        console.log(book.upvote.indexOf($scope.currentUser._id) != -1);
        return book.upvote.indexOf($scope.currentUser._id) != -1
    }
    $scope.checkIfDownVoted = (book) => {
        console.log(book.downvote.indexOf($scope.currentUser._id) != -1);
        return book.downvote.indexOf($scope.currentUser._id) != -1
    }

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
    $scope.addReadIt = bookId => {
        console.log('$scope.currentUser._id', $scope.currentUser._id)
        Book.readIt(bookId, $scope.currentUser._id)
            .then(res => {
                $state.reload();
                console.log('response after adding readit', res.data);
            })
            .catch(err => {
                console.log('error while adding readit', err);
            })
    }
    $scope.addLike = (bookId) => {
        Book.upVote(bookId, $scope.currentUser._id)
            .then(res => {
                $state.reload();
                console.log('response from book like', res.data);
            })
            .catch(err => {
                console.log('error while liking book', err);
            })
    }

    $scope.disLike = (bookId) => {
        Book.downVote(bookId, $scope.currentUser._id)
            .then(res => {
                $state.reload();
                console.log('response after downVote', res.data);
            })
            .catch(err => {
                console.log('error while downvoting:', err)
            })
    }
})
