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
        .state('profile.listBooks', {
            url: '/listBooks',
            views: {
                'main': {
                    templateUrl: '/html/listBooks.html',
                    controller: 'listBooksCtrl'
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
        .state('profile.wishList', {
            url: '/wishList',
            views: {
                'main': {
                    templateUrl: '/html/wishList.html',
                    controller: 'wishListCtrl'
                }
            }
        })
        .state('profile.followers', {
            url: '/followers',
            views: {
                'main': {
                    templateUrl: '/html/followers.html',
                    controller: 'mainCtrl'
                },
                'side': {
                    templateUrl: '/html/friendsList.html',
                    controller: 'mainCtrl'
                }
            }
        })
        .state('profile.following', {
            url: '/following',
            views: {
                'main': {
                    templateUrl: '/html/following.html',
                    controller: 'mainCtrl'
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
                            var id = $stateParams.id
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
