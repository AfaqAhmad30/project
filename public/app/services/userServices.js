angular.module('userServices', [])
.factory('user' ,function($http){
    userfactory = {};
    userfactory.create = function(regData){
        return $http.post('/api/users', regData);
    }
    return userfactory;
    
});