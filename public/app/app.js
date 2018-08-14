
angular.module('myApp', ['appRoutes','userControllers' , 'userServices', 'mainController','authServices','profileControllers','postControllers', 'followControllers'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});