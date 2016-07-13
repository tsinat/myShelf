'use strict';

var app = angular.module('myApp');

app.controller('newBookCtrl', function($scope, $state, Upload, Book, $location) {
    console.log('newBookCtrl');
    $scope.addBook = book => {
            console.log('currentUser', book);
             book.owner = $scope.currentUser._id

            Book.create(book)
                .then(res => {
                    console.log(res.data);
                    upload($scope.file, res.data._id);

                })
                .catch(err => {
                    console.log(err);
                })
        }
        // $scope.bookCover = () => {
        //     upload($scope.file, $scope.currentUser._id);
        // };

    function upload(file, id) {
        console.log(file, id);
        Upload.upload({
                url: `/api/images/books/${id}`,
                data: {
                    newFile: file
                },
                method: 'PUT'
            })
            .then(res => {
                console.log('res:', res);
                $state.go('profile');
            })
            .catch(err => {
                console.log('err:', err);
            })
    }
    $scope.isSecondAuthor = (book, num) => {
        return book.volumeInfo.authors.length > num;
    };

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
    $scope.addToCollection = (book) => {
        console.log('addToWhishList', book)
        let newBook = {
            title:book.volumeInfo.title,
            subtitle:book.volumeInfo.subtitle,
            thumbnail: book.volumeInfo.imageLinks.thumbnail,
            authors: book.volumeInfo.authors,
            googleId: book.id,
            category: book.volumeInfo.categories[0],
            description: book.volumeInfo.description,
            status: book.status
        }
        console.log('newBook', newBook);
        Book.create(newBook)
            .then(res => {
                console.log('response when wishbook is added', res.data);
                $location.path('profile/listBooks');
            })
            .catch(err => {
                console.log('error while adding wishBook', err);
            })
    }
});
