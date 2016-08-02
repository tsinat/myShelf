'use strict';

var app = angular.module('myApp');

app.controller('wishListCtrl', function($scope, Book, $state, $location) {
    console.log('wishListCtrl');
    $scope.search = () => {
        console.log('working');
        if($scope.wish) {
            Book.search($scope.wish.search)
            .then(res => {
                $scope.books = res.data.items;
                console.log('books', $scope.books);
            })
            .catch(err => {
                console.log('error while searching books:', err);
            })
        }
    }
    $scope.checkIfEmpty = () => {
        return $scope.currentUser.wishLists == ''
    }
    $scope.isSecondAuthor = (book, num) => {
        return book.volumeInfo.authors.length > num;
    };

    $scope.addToWhishList = (book) => {
        console.log('addToWhishList')
        let wishBook = {
            title:book.volumeInfo.title,
            subtitle:book.volumeInfo.subtitle,
            thumbnail: book.volumeInfo.imageLinks.thumbnail,
            authors: book.volumeInfo.authors,
            googleId: book.id,
            category: book.volumeInfo.categories[0],
            description: book.volumeInfo.description,
            sampleRead: book.accessInfo.webReaderLink,
            status: book.status,
            owner: $scope.currentUser._id,
        }
        console.log('wishBook', wishBook);
        Book.addWishBook(wishBook)
            .then(res => {
                console.log('response when wishbook is added', res.data);
                $location.path('profile/myWishList');
                $state.reload();
            })
            .catch(err => {
                console.log('error while adding wishBook', err);
            })
    }
})
