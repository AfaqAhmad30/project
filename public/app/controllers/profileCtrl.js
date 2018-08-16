angular.module('profileControllers', [])

.controller('profileCtrl', ['$routeParams', '$http', '$scope', function($routeParams, $http, $scope) {
    $scope.userProfileId = $routeParams.userId;
    $scope.userPostsMedia = [];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    $http.post('/api/getProfileDetails', { userProfileId: $scope.userProfileId }).then((result) => {
        $scope.userDetails = result.data;
        $scope.userDetails.DOB = monthNames[new Date(result.data.DOB).getMonth()] + ' ' + new Date(result.data.DOB).getDate() + ', ' + new Date(result.data.DOB).getFullYear();
        $scope.userDetails.joinedDate = monthNames[new Date(result.data.joinedDate).getMonth()] + ' ' + new Date(result.data.joinedDate).getDate() + ', ' + new Date(result.data.joinedDate).getFullYear();
    }).catch((err) => {
        console.log(err);
    });

    $http.post('/api/getPostsImages', {author: $scope.userProfileId}).then((posts) => {
        $scope.userPostsMedia = posts.data;
    }).catch((err) => {
        console.log(err);
    })
    

}])