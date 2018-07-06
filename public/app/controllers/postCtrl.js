
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
    $scope.description = '';
    $scope.myFile ='';

    var newPost = {};
    
    $scope.addNewPost = function() {
        newPost.author = author;
        newPost.description = $scope.description;
        newPost.file = $scope.myFile;
        console.log($scope.myFile);
        uploadPost.uploadIt(newPost).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    };
}]);