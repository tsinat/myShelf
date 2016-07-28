'use strict';

var app = angular.module('myApp', ['ui.router', 'ngFileUpload', 'angular-loading-bar', 'ngAnimate', 'angularModalService']);

app.run(function(Auth) {
    Auth.getProfile();
});

app.config(function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider,$uiViewScrollProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    $uiViewScrollProvider.useAnchorScroll();
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
                profile: function(Auth, $q, $state, $location) {
                    return Auth.getProfile()
                        .then(res => {
                            return $q.resolve();
                            $location.path('/profile/followers');
                        })
                        .catch(() => {
                            $state.go('home');
                            return $q.reject();
                        });
                }
            }

        })
        .state('profile.booksFeed', {
            url: '/booksFeed/',
            views: {
                'main': {
                    templateUrl: '/html/booksFeed.html',
                    controller: 'booksFeedCtrl',
                    resolve: {
                        booksFeed: function(Book, $state, $stateParams) {
                            return Book.getBooksFeed()
                                .then(res => {
                                    console.log('booksFeed:', res.data);
                                    return res.data;
                                })
                                .catch(err => {
                                    console.log('error while getting book detail', err)
                                })
                        }
                    }
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.listBooks', {
            url: '/listBooks',
            views: {
                'main': {
                    templateUrl: '/html/listBooks.html',
                    controller: 'listBooksCtrl'
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.profileEditor', {
            url: '/profileEditor',
            views: {
                'main': {
                    templateUrl: '/html/profileEditor.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.profileImageUpload', {
            url: '/profileImageUpload',
            views: {
                'main': {
                    templateUrl: '/html/profileImageUpload.html',
                    controller: 'mainCtrl'
                }
            }

        })
        .state('profile.newBook', {
            url: '/newBook',
            views: {
                'main': {
                    templateUrl: '/html/newBook.html',
                    controller: 'newBookCtrl'
                }
            }
        })
        .state('profile.addBook', {
            url: '/addBook',
            views: {
                'main': {
                    templateUrl: '/html/addBook.html',
                    controller: 'newBookCtrl'
                }
            }
        })
        .state('profile.bookDetail', {
            url: '/bookDetail/:googleId/detail/:id',
            views: {
                'main': {
                    templateUrl: '/html/bookDetail.html',
                    controller: 'bookDetailCtrl',
                    resolve: {
                        detailBook: function(Book, $state, $stateParams) {
                            let googleId = $stateParams.googleId;
                            return Book.getDetail(googleId)
                                .then(res => {
                                    console.log('bookDetail:', res.data);
                                    return res;
                                })
                                .catch(err => {
                                    console.log('error while getting book detail', err)
                                })
                        },
                        getDbDeatil: function(Book, $state, $stateParams) {
                            let id = $stateParams.id;
                            console.log('id:', id);
                            return Book.getDetailFromDb(id)
                                .then(res => {
                                    console.log('detail from db:', res.data);
                                    return res;
                                })
                                .catch(err => {
                                    console.log('error while getting detail from db', err);
                                })
                        }
                    }
                }
            }
        })
        .state('profile.myWishList', {
            url: '/myWishList',
            views: {
                'main': {
                    templateUrl: '/html/myWishList.html',
                    controller: 'wishListCtrl'
                }
            }
        })
        .state('profile.addWishList', {
            url: '/addWishList',
            views: {
                'main': {
                    templateUrl: '/html/addWishList.html',
                    controller: 'wishListCtrl'
                }
            }
        })
        .state('profile.followers', {
            url: '/followers/:id',
            views: {
                'main': {
                    templateUrl: '/html/followers.html',
                    controller: 'loggedDetailsCtrl',
                    resolve: {
                        loggedDetails: function(User, $q, $state, $stateParams) {
                            let id = $stateParams.id;
                            console.log('id', id);
                            return User.getOne(id)
                                .then(res => {
                                    console.log('res:', res.data);
                                    return res.data
                                        // $state.go('profile.friendDetail');
                                })
                                .catch(err => {
                                    console.log('error while getting single user', err);
                                    $state.go('profile');
                                });
                        }
                    }
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.following', {
            url: '/following/:id',
            views: {
                'main': {
                    templateUrl: '/html/following.html',
                    controller: 'loggedDetailsCtrl',
                    resolve: {
                        loggedDetails: function(User, $q, $state, $stateParams) {
                            let id = $stateParams.id;
                            return User.getOne(id)
                                .then(res => {
                                    console.log('res:', res.data);
                                    return res.data
                                        // $state.go('profile.friendDetail');
                                })
                                .catch(err => {
                                    console.log('error while getting single user', err);
                                    $state.go('profile');
                                });
                        }
                    }
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.users', {
            url: '/users',
            views: {
                'main': {
                    templateUrl: '/html/searchUsers.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.friendDetail', {
            url: '/friendDetail/:id',
            views: {
                'main': {
                    templateUrl: '/html/friendDetail.html',
                    controller: 'friendDetailCtrl',
                    resolve: {
                        friend: function(User, $q, $state, $stateParams) {
                            let id = $stateParams.id
                            return User.getOne(id)
                                .then(res => {
                                    console.log('res:', res.data);
                                    return res.data
                                        // $state.go('profile.friendDetail');
                                })
                                .catch(err => {
                                    console.log('error while getting single user', err);
                                    $state.go('profile');
                                });

                        }
                    }
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/profile');
});
