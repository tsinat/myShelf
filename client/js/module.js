'use strict';

var app = angular.module('myApp', ['ui.router', 'ngFileUpload']);

app.run(function(Auth) {
    Auth.getProfile();
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/html/home.html',
            controller: 'loginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: '/html/register.html',
            controller: 'registerCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/html/login.html',
            controller: 'loginCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: '/html/profile.html',
            controller: 'mainCtrl',
            resolve: {
                profile: function(Auth, $q, $state) {
                    return Auth.getProfile()
                        .then(res => {
                            return $q.resolve();
                            $state.go('profile');
                        })
                        .catch(() => {
                            $state.go('home');
                            return $q.reject();
                        });
                }
            }
        })
        .state('profile.listBooks', {
            url: '/listBooks',
            templateUrl: '/html/listBooks.html',
            controller: 'listBooksCtrl'
        })
        .state('profile.profileEditor', {
            url: '/profileEditor',
            templateUrl: '/html/profileEditor.html',
            controller: 'mainCtrl'
        })
        .state('profile.profileImageUpload', {
            url: '/profileImageUpload',
            templateUrl: '/html/profileImageUpload.html',
            controller: 'mainCtrl'
        })
        .state('profile.newBook', {
            url: '/newBook',
            templateUrl: '/html/newBook.html',
            controller: 'newBookCtrl'
        })
        .state('profile.followers', {
            url: '/followers',
            templateUrl: '/html/followers.html',
            controller: 'mainCtrl'
        })
        .state('profile.following', {
            url: '/following',
            templateUrl: '/html/following.html',
            controller: 'mainCtrl'
        })

    $urlRouterProvider.otherwise('/profile');
});
