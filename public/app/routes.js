angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

    $routeProvider
    
    .when('/', {
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/profile', {
        templateUrl: 'app/views/pages/profile.html'
    })

    .when('/messages', {
        templateUrl: 'app/views/pages/messages.html'

    })
    .when('/auth',{
        templateUrl:'app/views/pages/auth.html'
        
    })

    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
});
