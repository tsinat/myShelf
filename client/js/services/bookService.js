'use strict';

var app = angular.module('myApp');

app.service('Book', function($http, $q) {
    this.create = book => {
        return $http.post('api/books/', book);
    }
    this.getBooksFeed = () => {
        return $http.get(`api/books/`);
    }
    this.search = searchTerm => {
        let temp = searchTerm.split(' ');
        temp = temp.join('+');
        return $http.get(`https://www.googleapis.com/books/v1/volumes?q=${temp}&maxResults=20`);
        // return $http.get("https://www.googleapis.com/books/v1/volumes/yq1xDpicghkC");
        // return $http.get("http://books.google.com/books/about/The_God_Delusion.html?hl=&id=yq1xDpicghkC");
    }
    this.getDetail = id => {
        console.log('BookDetails:', id);
        return $http.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
    }
    this.addNewComment = (newComment, bookId) => {
        return $http.put(`api/books/addComment/${bookId}`, newComment);
    }
});
