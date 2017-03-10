'use strict';

var app = angular.module('myApp');

app.controller('booksFeedCtrl', function($scope, Book, $state, booksFeed) {
    $scope.booksFeed = booksFeed.reverse();

    function updateFeed(){
        Book.getBooksFeed()
            .then(res => {
                $scope.booksFeed  = res.data;
            })
            .catch(err => {
                console.log('error while getting book detail', err)
            })
    }

    $scope.checkIfUpVoted = (book) => {
        return book.upvote.indexOf($scope.currentUser._id) != -1
    }

    $scope.checkIfDownVoted = (book) => {
        return book.downvote.indexOf($scope.currentUser._id) != -1
    }

    $scope.addComment = (comment, bookId) => {
        if(comment != undefined) {
            let newComment = {
                content: comment,
                by: $scope.currentUser._id
            }
            Book.addNewComment(newComment, bookId)
                .then(res => {
                    updateFeed();
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
                updateFeed();
            })
            .catch(err => {
                console.log('error while adding readit', err);
            })
    }

    $scope.addLike = (bookId) => {
        Book.upVote(bookId, $scope.currentUser._id)
            .then(res => {
                updateFeed();
            })
            .catch(err => {
                console.log('error while liking book', err);
            })
    }

    $scope.disLike = (bookId) => {
        Book.downVote(bookId, $scope.currentUser._id)
            .then(res => {
                updateFeed();
            })
            .catch(err => {
                console.log('error while downvoting:', err)
            })
    }
})
