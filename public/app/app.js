
angular.module('myApp', ['appRoutes','userControllers' , 'userServices', 'mainController','authServices','postControllers'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});