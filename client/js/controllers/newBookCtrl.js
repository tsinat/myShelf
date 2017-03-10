'use strict';

var app = angular.module('myApp');

app.controller('newBookCtrl', function($scope, $state, Upload, Book, $location) {
    $scope.addBook = book => {
             book.owner = $scope.currentUser._id

            Book.create(book)
                .then(res => {
                    upload($scope.file, res.data._id);
                })
                .catch(err => {
                    console.log(err);
                })
        }

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
                $state.go('profile');
            })
            .catch(err => {
                console.log('err:', err);
            })
    }

    $scope.isSecondAuthor = (book, num) => {
        if(book.volumeInfo.authors){
            return book.volumeInfo.authors.length > num;
        }
        return false;
    };

    $scope.search = () => {
        if($scope.wish) {
            Book.search($scope.wish.search)
            .then(res => {
                $scope.books = res.data.items;
            })
            .catch(err => {
                console.log('error while searching books:', err);
            })
        }
    }

    $scope.addToCollection = (book) => {
        console.log('book:', book);
        let newBook = {
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
        Book.create(newBook)
            .then(res => {
                $state.go('profile.booksFeed');
                console.log('response when wishbook is added', res.data);
            })
            .catch(err => {
                console.log('error while adding wishBook', err);
            })
    }
});
