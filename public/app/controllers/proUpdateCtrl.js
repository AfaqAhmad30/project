angular.module('profileUpdateControllers', ['ngFileUpload'])

.controller('proUpdateCtrl', ['$http', '$scope', function($http, $scope) {

    $scope.userData = {};

    $http.post('/api/getProfileDetails', {userProfileId: $scope.loginUserId}).then((profileDetails) => {
        profileDetails.data.DOB = new Date(profileDetails.data.DOB);
        $scope.userData = profileDetails.data;
    }).catch((err) => {
        console.log(err);
    });

    $scope.updateProfile = function() {
        $http.post('/api/updateUserProfile', $scope.userData).then((resp) => {
            console.log(resp);
        }).catch((err) => {
            console.log(err);
        });
    };
}])