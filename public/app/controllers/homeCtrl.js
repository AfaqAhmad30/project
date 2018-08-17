angular.module('homeControllers', ['ngFileUpload'])

.controller('homeCtrl', ['$scope', '$http', 'Upload', '$rootScope', function($scope, $http, Upload, $rootScope) {

    var userData = {
        author: $rootScope.loginUserId,
        page: 'home'
    };

    $scope.userDetails = {};

    $http.post('/api/getProfileDetails', { userProfileId: userData.author }).then((result) => {
        $scope.userDetails = result.data;
    }).catch((err) => {
        console.log(err);
    });

    // Array for storing posts
    $scope.homePosts = [];

    $scope.showHideComment = false;

    // Get all the post for user timeline
    $http.post('/api/posts', userData).then((posts) => {
        $scope.homePosts = posts.data;
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


    // comment insertion
    // click on comment post button
    $scope.placeComment = function(postId, userId, index) {
        $http.post('/api/post/newComment', {
            postId: postId,
            userId: userId,
            commentedText: $scope.homePosts[index].comment
        }).then((result) => {
            $http.post('/api/post/getComment', {_id: result.data._id}).then((comment) => {
                comment.data.commentedOn = moment(comment.data.commentedOn).fromNow();
                $scope.homePosts[index].comments.push(comment.data);
                $scope.homePosts[index].comment = '';
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    $scope.deleteComment = function(commentId, parentIndex, index) {
        $http.post('/api/post/deleteComment', {_id: commentId}).then((result) => {
            $scope.homePosts[parentIndex].comments.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        });
    };

    // delete post
    $scope.deletePost = function(postId, index) {
        $http.post('/api/post/deletePost', {_id: postId}).then((resp) => {
            $scope.homePosts.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        });
    };

    // like or unlike a post
    $scope.postLiked = (postId, authorId, userId, index) => {
        var message = '';
        $http.post('/api/postLiked', { postId: postId, userId: userId }).then((resp) => {
            if(resp.data.message === 'post like') {
                $scope.homePosts[index].likes++;
                message = 'like';
            } else {
                $scope.homePosts[index].likes--;
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

    // total followes of login user
    $http.post('/api/totalFollowers', {userId: $rootScope.loginUserId}).then((totalFollowers) => {
        $scope.totalFollowersOfLoginUser = totalFollowers.data;
    }).catch((err) => {
        console.log(err);
    });

    // total following of login user
    $http.post('/api/totalFollowing', {userId: $rootScope.loginUserId}).then((totalFollowing) => {
        $scope.totalFollowingOfLoginUser = totalFollowing.data;
    }).catch((err) => {
        console.log(err);
    });


}]);