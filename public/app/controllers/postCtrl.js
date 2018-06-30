
// Dummy user
var author = '5b30c5d6ed24a1da46e5ff69';


angular.module('postControllers', ['postsServices'])

.controller('postCtrl', ['$scope', '$http', 'uploadPost', function($scope, $http, uploadPost) {
    
    // Get all the post for user timeline
    $scope.posts = [];
    $http.get('/api/posts').then((posts) => {
        $scope.posts = posts.data;
    }).catch((err) => {
        console.log(err);
    });


    // When user save a new post
    var newPost = {};
    newPost.author = author;
    $scope.description = '';
    $scope.myFile = '';
    $scope.addNewPost = function() {
        console.log($scope.myFile);
        newPost.description = $scope.description;
        uploadPost.uploadIt($scope.myFile, newPost).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    };
}]);