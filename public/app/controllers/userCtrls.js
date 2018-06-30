angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, user){
    var app = this;
    this.regUser = function(regData){
        app.errorMsg = false;
        // console.log('Form Submitted');
        user.create(app.regData).then(function(data){
            // console.log(data.data.success);
            // console.log(data.data.message);
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $location.path('/home')
                },3000);
                
            }else{
                app.errorMsg = data.data.message;
            }
        });
    };  
});