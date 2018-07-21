angular.module('authServices', [])
.factory('auth' ,function($http, authToken, $window){
    var authfactory = {};
    authfactory.login = function(loginData){
        return $http.post('/api/authenticate', loginData).then(function(data){
             authToken.setToken(data.data.token);
            return data;
        });
    };
        authfactory.isLoggedIn = function(){
            if(authToken.getToken()){
                return true;
            } else 
            {
                return false;
            }
        };

        authfactory.getUser = function() {
            if(authToken.getToken()){
                return $http.post('/api/crntUser');
            } else {
                $q.reject({message: 'user has no token'});
            }
        };

        authfactory.logout = function() {
            authToken.setToken();
        }
        
    return authfactory;
})

.factory('authToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.setToken = function(token) {
            if(token){
                $window.localStorage.setItem('token', token);
            } else{
                $window.localStorage.removeItem('token');
            }
    };

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors', function(authToken){
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function(config){
   
        var token = authToken.getToken();
 
        if(token) config.headers['x-access-token'] = token;
        return config;
    };
    return authInterceptorsFactory;
});