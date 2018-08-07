angular.module('postServices', [])

 .service('uploadPost', ['$http', function($http) {
     var post = this;
     post.uploadIt = function(postData) {
        return $http.post('api/newPost', postData);
     };
 }])