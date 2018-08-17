
angular.module('postControllers', ['ngFileUpload'])

.controller('postCtrl', ['$scope', '$http', 'Upload', '$routeParams', '$location', '$rootScope', function($scope, $http, Upload, $routeParams, $location, $rootScope) {

    var userData = {
        author: $routeParams.userId
    };

    // Array for storing posts
    $scope.posts = [];

    $scope.showHideComment = false;

    // Get all the post for user timeline
    $http.post('/api/posts', userData).then((posts) => {
        $scope.posts = posts.data;
        posts.data.forEach(function(post) {
            post.time = moment(post.time).fromNow();

            // getting comments of current post
            $http.post('/api/post/getComments', {postId: post._id}).then((comments) => {
                post.comments = comments.data;
                comments.data.forEach(function(comment) {
                    comment.commentedOn = moment(comment.commentedOn).fromNow();
                })
            });

            // getting likes of current post
            $http.post('api/post/getLikes', {postId: post._id}).then((likes) => {
                post.likes = likes.data.length;
            });

        });
    }).catch((err) => {
        console.log(err);
    }); // End of getting all posts


    // add new post to user profile
    $scope.newPost = {};
    $scope.newPost.author = userData.author;
    $scope.newPost.description = '';
    
    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        } else {
            $http.post('/api/newPostWithoutPic', {newPost: $scope.newPost}).then((resp) => {
                $http.post('/api/posts', userData).then((posts) => {
                    posts.data[0].time = moment(posts.data[0].time).fromNow();
                    $scope.posts.unshift(posts.data[0]);
                    $scope.newPost.description = '';
                });
            }).catch((err) => {

            })
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
                $scope.newPost.description = '';
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


    // delete post
    $scope.deletePost = function(postId, index) {
        $http.post('/api/post/deletePost', {_id: postId}).then((resp) => {
            $scope.posts.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        });
    };


    // comment insertion
    // click on comment post button
    $scope.placeComment = function(postId, userId, index) {
        $http.post('/api/post/newComment', {
            postId: postId,
            userId: userId,
            commentedText: $scope.posts[index].comment
        }).then((result) => {
            $http.post('/api/post/getComment', {_id: result.data._id}).then((comment) => {
                // get all comment from db
                comment.data.commentedOn = moment(comment.data.commentedOn).fromNow();
                $scope.posts[index].comments.push(comment.data);
                $scope.posts[index].comment = '';
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    $scope.deleteComment = function(commentId, parentIndex, index) {
        $http.post('/api/post/deleteComment', {_id: commentId}).then((result) => {
            $scope.posts[parentIndex].comments.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        });
    };
    
    // like or unlike a post
    $scope.postLiked = (postId, authorId, userId, index) => {
        var message = '';
        $http.post('/api/postLiked', { postId: postId, userId: userId }).then((resp) => {
            if(resp.data.message === 'post like') {
                $scope.posts[index].likes++;
                message = 'like';
            } else {
                $scope.posts[index].likes--;
                message = 'unlike';
            }

            // push notification
            if(authorId !== userId) {
                $http.post('/api/postNotification', {postId: postId, authorId: authorId, userId: userId, action: message}).then((resp) => {
                    console.log(resp);
                });
            }

        }).catch((err) => {
            console.log(err);
        })
    };


}]);