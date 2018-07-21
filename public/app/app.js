
angular.module('myApp', ['appRoutes','userControllers' , 'userServices', 'mainController','authServices','profileControllers','postControllers'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});