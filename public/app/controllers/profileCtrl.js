angular.module('profileControllers', [])

.controller('profileCtrl', ['$routeParams', '$http', '$scope', function($routeParams, $http, $scope) {
    var data = {
        userProfileId: $routeParams.userId
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    $http.post('/api/getProfileDetails', data).then((result) => {
        $scope.userDetails = result.data;
        $scope.userDetails.DOB = monthNames[new Date(result.data.DOB).getMonth()] + ' ' + new Date(result.data.DOB).getDate() + ', ' + new Date(result.data.DOB).getFullYear();
    }).catch((err) => {
        console.log(err);
    });
}])