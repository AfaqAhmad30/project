angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/profile', {
        templateUrl: 'app/views/pages/profile.html',
        access: {restricted: true}
    })

    .when('/profile/:userId', {
        templateUrl: 'app/views/pages/profile.html'
    })

    .when('/messages', {
        templateUrl: 'app/views/pages/messages.html'

    })
    
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

    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
