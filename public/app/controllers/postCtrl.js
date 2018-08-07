
angular.module('postControllers', ['ngFileUpload', 'postServices'])

.controller('postCtrl', ['$scope', '$http', 'uploadPost', '$routeParams', function($scope, $http, uploadPost, $routeParams) {
    var data = {
        author: $routeParams.userId
    };

    // Get all the post for user timeline
    $scope.posts = [];
    $http.post('/api/posts', data).then((posts) => {
        $scope.posts = posts.data;
        posts.data.forEach(function(post) {
            post.time = moment(post.time).fromNow();
        });
    }).catch((err) => {
        console.log(err);
    });


    // When user save a new post
    $scope.description = '';
    $scope.myFile ='';

    var newPost = {};
    
    $scope.addNewPost = function() {
        newPost.author = data.author;
        newPost.description = $scope.description;
        uploadPost.uploadIt(newPost).then((result) => {

            $http.post('/api/posts', data).then((posts) => {
                posts.data[0].time = moment(posts.data[0].time).fromNow();
                $scope.posts.unshift(posts.data[0]);
            }).catch((err) => {
                console.log(err);
            });

            console.log(result.data);
        }).catch((err) => {
            console.log(err);
        });
    };

    // angular.module('fileUpload', ['ngFileUpload'])
    // .controller('MyCtrl',['Upload','$window',function(Upload,$window){
    //     var vm = this;
    //     vm.submit = function(){ //function to call on form submit
    //         if (vm.upload_form.file.$valid &amp;&amp; vm.file) { //check if from is valid
    //             vm.upload(vm.file); //call upload function
    //         }
    //     }
    //     vm.upload = function (file) {
    //         Upload.upload({
    //             url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
    //             data:{file:file} //pass file as data, should be user ng-model
    //         }).then(function (resp) { //upload function returns a promise
    //             if(resp.data.error_code === 0){ //validate success
    //                 $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
    //             } else {
    //                 $window.alert('an error occured');
    //             }
    //         }, function (resp) { //catch error
    //             console.log('Error status: ' + resp.status);
    //             $window.alert('Error status: ' + resp.status);
    //         }, function (evt) { 
    //             console.log(evt);
    //             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    //             vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
    //         });
    //     };
    // }]);




}]);