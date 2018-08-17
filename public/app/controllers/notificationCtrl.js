angular.module('notificationControllers', [])

.controller('notificationCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.notifications = [];

    $http.post('/api/getNotification', {authorId: $scope.loginUserId}).then((notifications) => {
        notifications.data.forEach(function(notification) {
            notification.time = moment(notification.time).fromNow();
        });
        $scope.notifications = notifications.data;    
    }).catch((err) => {
        console.log(err);
    });
}]);