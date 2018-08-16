angular.module('appRoutes',['ngRoute'])

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
        .when('/messages', {
            templateUrl: 'app/views/pages/messages.html'
        })
        .when('/search', {
            templateUrl: 'app/views/pages/searcUsers.html'
        })
        .when('/profileEdit', {
            templateUrl: 'app/views/pages/profileEdit.html'
        })

        .otherwise({ redirectTo: '/' });


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
