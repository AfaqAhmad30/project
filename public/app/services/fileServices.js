angular.module('postsServices', [])


 .service('uploadPost', ['$http', function($http) {
     var post = this;
     post.uploadIt = function(file, postData) {
         var formData = new FormData();
         formData.append('file', file);
         formData.append('description', postData.description);
         formData.append('author', postData.author);

         console.log(file);

         return $http.post('api/posts', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
     };
 }])