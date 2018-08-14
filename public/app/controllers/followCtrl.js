angular.module('followControllers', [])

.controller('followCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.userProfileId = $routeParams.userId;
    $scope.followingUsers = [];
    $scope.followerUsers = [];

    // ..... For Following section
    // to get the users that you follow
    $http.post('/api/getFollowing', {follower: $scope.userProfileId}).then((result) => {
        result.data.forEach(function(user) {
            user.followed.followBtn = 'Following';
        });
        $scope.followingUsers = result.data;
    }).catch((err) => {
        console.log(err);
    });

    $scope.followedBtn = function(follower, followed, index) {
        $http.post('/api/follow', { follower, followed }).then((result) => {
            if(result.data.message === 'follow') {
                $scope.followingUsers[index].followed.followBtn = 'Following';
            } else {
                $scope.followingUsers[index].followed.followBtn = 'Follow';
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    
    // ..... For Followers Section
    // to get the users who are following you
    $http.post('/api/getFollower', {followed: $scope.userProfileId}).then((followers) => {
        followers.data.forEach(function(follower) {
            // checking, am I following my followers
            $http.post('/api/isFollowed', {followed: follower.follower._id, follower: $scope.userProfileId}).then((result) => {
                if(result.data.message === 'yes') {
                    follower.follower.followBtn = 'Following';
                } else {
                    follower.follower.followBtn = 'Follow';
                }
            });
        $scope.followerUsers = followers.data;
        });
    }).catch((err) => {
        console.log(err);
    });

    $scope.followerBtn = function(follower, followed, index) {
        $http.post('/api/follow', { follower, followed }).then((result) => {
            if(result.data.message === 'follow') {
                $scope.followerUsers[index].follower.followBtn = 'Following';
            } else {
                $scope.followerUsers[index].follower.followBtn = 'Follow';
            }
        }).catch((err) => {
            console.log(err);
        });
    };

}]);