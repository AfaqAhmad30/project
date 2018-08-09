
angular.module('postControllers', ['ngFileUpload', 'postServices'])

.controller('postCtrl', ['$scope', '$http','Upload', 'uploadPost', '$routeParams', function($scope, $http, Upload, uploadPost, $routeParams) {
    var app = this;
    var userData = {
        author: $routeParams.userId
    };

    // Get all the post for user timeline
    $scope.posts = [];
    $http.post('/api/posts', userData).then((posts) => {
        $scope.posts = posts.data;
        posts.data.forEach(function(post) {
            post.time = moment(post.time).fromNow();
            //this.imageUrl = post.media.path;
        });
    }).catch((err) => {
        console.log(err);
    }); // End of getting all posts


    $scope.newPost = {};
    $scope.newPost.author = userData.author;
    $scope.newPost.description = '';
    
    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: 'api/newPost',
            data: {file: file, newPost: $scope.newPost}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            console.log(resp);
            $http.post('/api/posts', userData).then((posts) => {
                posts.data[0].time = moment(posts.data[0].time).fromNow();
                $scope.posts.unshift(posts.data[0]);
            }).catch((err) => {
                console.log(err);
            });

        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };


}]);