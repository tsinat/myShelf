'use strict';

var app = angular.module('myApp');

app.controller('bookDetailCtrl', function($scope, Book, $state, detailBook, getDbDeatil) {
    console.log('bookDetailCtrl');
    $scope.bookDetails = detailBook.data;
    $scope.bookDetailFromDb = getDbDeatil.data;
    console.log('lastchance', $scope.bookDetails);
    console.log('from db', $scope.bookDetailFromDb);

    $scope.addComment = (comment, bookId) => {
        console.log('comment:', comment)
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
