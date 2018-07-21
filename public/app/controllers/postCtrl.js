
angular.module('postControllers', ['postServices'])

.controller('postCtrl', ['$scope', '$http', 'uploadPost', '$routeParams', function($scope, $http, uploadPost, $routeParams) {
    var data = {
        author: $routeParams.userId
    };

    // Get all the post for user timeline
    $scope.posts = [];
    $http.post('/api/posts', data).then((posts) => {
        $scope.posts = posts.data;
        posts.data.forEach(function(post) {
            post.time = moment(post.time).fromNow();
        });
    }).catch((err) => {
        console.log(err);
    });


    // When user save a new post
    $scope.description = '';
    $scope.myFile ='';

    var newPost = {};
    
    $scope.addNewPost = function() {
        newPost.author = data.author;
        newPost.description = $scope.description;
        newPost.file = $scope.myFile;
        uploadPost.uploadIt(newPost).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    };
}]);