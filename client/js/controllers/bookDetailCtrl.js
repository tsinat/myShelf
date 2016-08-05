'use strict';

var app = angular.module('myApp');

app.controller('bookDetailCtrl', function($scope, Book, $state, detailBook, getDbDeatil, booksFeed) {
    console.log('bookDetailCtrl');
    $scope.bookDetails = detailBook.data;
    $scope.bookDetailFromDb = getDbDeatil.data;
    console.log('lastchance', $scope.bookDetails);
    console.log('from db', $scope.bookDetailFromDb);

    function updateFeed(){
        Book.getBooksFeed()
            .then(res => {
                $scope.booksFeed  = res.data;
                // $scope.$apply;
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
    $scope.addReadIt = bookId => {
        console.log('$scope.currentUser._id', $scope.currentUser._id)
        Book.readIt(bookId, $scope.currentUser._id)
            .then(res => {
                updateFeed();
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
                // updateFeed();
                $state.reload();
                console.log('response after downVote', res.data);
            })
            .catch(err => {
                console.log('error while downvoting:', err)
            })
    }

    $scope.addComment = (comment, bookId) => {
        console.log('comment:', comment)
        console.log('bookid:', bookId)
        let newComment = {
            content: comment,
            by: $scope.currentUser._id
        }
        Book.addNewComment(newComment, bookId)
            .then(res => {
                updateFeed();
                console.log('response after saving comment', res.data);
            })
            .catch(err => {
                console.log('error while saving comment:', err);
            })

    }
    $scope.deleteOneBook = id => {
        console.log('deleting one book:', id);
        Book.deleteOne(id)
            .then(res => {
                $state.reload();
                $state.go('profile.listBooks');
                console.log('response after book is deleted', res.data);
            })
            .catch(err => {
                console.log('error while deleting one book', err);
            })
    }
});
