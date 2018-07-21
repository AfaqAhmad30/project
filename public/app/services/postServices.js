angular.module('postServices', [])

 .service('uploadPost', ['$http', function($http) {
     var post = this;
     post.uploadIt = function(postData) {
        var formData = new FormData();
        formData.append('file', postData.file);
        formData.append('description', postData.description);
        formData.append('author', postData.author);

        return $http.post('api/newPost', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
     };
 }])