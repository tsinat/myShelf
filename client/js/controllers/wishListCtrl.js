'use strict';

var app = angular.module('myApp');

app.controller('wishListCtrl', function($scope, Book, User) {
    console.log('wishListCtrl');
    $scope.search = () => {
        console.log('working');
        if($scope.wish) {
            Book.search($scope.wish.search)
            .then(res => {
                // console.log('search response', res.data);
                $scope.books = res.data.items;
                console.log('books', $scope.books);
            })
            .catch(err => {
                console.log('error while searching books:', err);
            })
        }
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
            description: book.volumeInfo.description
        }
        console.log('wishBook', wishBook);
        User.addWishBook(wishBook, $scope.currentUser._id)
            .then(res => {
                console.log('response when wishbook is added', res.data);
            })
            .catch(err => {
                console.log('error while adding wishBook', err);
            })
    }
})
