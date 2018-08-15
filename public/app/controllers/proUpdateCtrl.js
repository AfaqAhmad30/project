angular.module('profileUpdateControllers', ['ngFileUpload'])

.controller('proUpdateCtrl', ['$http', '$scope', 'Upload', function($http, $scope, Upload) {

    $scope.userData = {};

    $http.post('/api/getProfileDetails', {userProfileId: $scope.loginUserId}).then((profileDetails) => {
        profileDetails.data.DOB = new Date(profileDetails.data.DOB);
        $scope.userData = profileDetails.data;
    }).catch((err) => {
        console.log(err);
    });

    $scope.updateProfile = function() {
        $http.post('/api/updateUserProfile', $scope.userData).then((resp) => {
            if(resp.data.message === 'updated') {
                $scope.userData.message = resp.data.message;
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    $scope.updateDP =function() {
        if ($scope.form2.dp.$valid && $scope.dp) {
            $scope.upload($scope.dp, '/api/updateDP');
        } else {
            $scope.dpErrorMsg = 'Please select profile image';
        }
    }

    $scope.updateCover =function() {
        if ($scope.form1.cover.$valid && $scope.cover) {
            $scope.upload($scope.cover, '/api/updateCover');
        } else {
            $scope.coverErrorMsg = 'Please select cover image';
        }
    }

    // upload on file select or drop
    $scope.upload = function (file, url) {
        Upload.upload({
            url: url,
            data: {file: file, userId: $scope.loginUserId}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.userData.profile = resp.data.profile;
            $scope.userData.cover = resp.data.cover;
            console.log(resp.data.cover);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}])