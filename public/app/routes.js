angular.module('appRoutes',['ngRoute', 'ui.router'])

// .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
//     $urlRouterProvider.otherwise('/')
//     $stateProvider
//         .state('home', {
//             url: '/',
//             templateUrl: 'app/views/pages/home.html'
//         })
//         .state('profile', {
//             url: '/profile/:userId',
//             templateUrl: 'app/views/pages/profile.html'
//         })
//         .state('messages', {
//             url: '/messages',
//             templateUrl: 'app/views/pages/messages.html'
//         })
//         .state('registration', {
//             url: '/register',
//             templateUrl: 'app/views/pages/register.html',
//             controller: 'regCtrl',
//             controllerAs: 'register',
//             access: {restricted: false}
//         })
//         .state('login', {
//             url: '/login',
//             templateUrl: 'app/views/pages/login.html',
//             access: {restricted: false}
//         });

//         $locationProvider.html5Mode({
//             enabled: true,
//             requireBase: false
//           });
// });

.config(function($routeProvider,$locationProvider){

    $routeProvider
        .when('/register',{
            templateUrl:'app/views/pages/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            access: {restricted: false}
            
        })
        .when('/login',{
            templateUrl:'app/views/pages/login.html',
            access: {restricted: false}
        })
        .when('/', {
            templateUrl: 'app/views/pages/home.html'
        })
        .when('/profile/:userId', {
            templateUrl: 'app/views/pages/profile.html'
        })
        .when('/profile/:userId/about', {
            templateUrl: 'app/views/pages/profile/about.html'
        })
        .when('/profile/:userId/friends', {
            templateUrl: 'app/views/pages/profile/friends.html'
        })
        .when('/profile/:userId/photos', {
            templateUrl: 'app/views/pages/profile/photos.html'
        })
        .when('/messages', {
            templateUrl: 'app/views/pages/messages.html'

        })
        .otherwise({ redirectTo: '/' });


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
