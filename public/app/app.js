
angular.module('myApp', ['appRoutes','userControllers' , 'userServices', 'mainController','authServices','profileControllers','postControllers', 'followControllers', 'profileUpdateControllers', 'homeControllers'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});