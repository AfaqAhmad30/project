 angular.module('mainController', ['authServices'])
.controller('mainCtrl', function(auth, $timeout, $location, $rootScope, $http){
    var app = this;
    app.doActive = function(loc) {
        
        if(loc === 'home') {
            var a = angular.element( document.querySelector( '.homeLoc' ) );
            var b = angular.element( document.querySelector( '.msgLoc' ) );
            var c = angular.element( document.querySelector( '.proLoc' ) );
            a.addClass('makeActive');
            b.removeClass('makeActive');
            c.removeClass('makeActive');
        } else if(loc === 'messages') {
            var a = angular.element( document.querySelector( '.homeLoc' ) );
            var b = angular.element( document.querySelector( '.msgLoc' ) );
            var c = angular.element( document.querySelector( '.proLoc' ) );
            a.removeClass('makeActive');
            b.addClass('makeActive');
            c.removeClass('makeActive');
        } else {
            var a = angular.element( document.querySelector( '.homeLoc' ) );
            var b = angular.element( document.querySelector( '.msgLoc' ) );
            var c = angular.element( document.querySelector( '.proLoc' ) );
            a.removeClass('makeActive');
            b.removeClass('makeActive');
            c.addClass('makeActive');
        }

    };

    $rootScope.$on('$routeChangeStart', function() {
        if(auth.isLoggedIn()) {
            console.log('Success: user is logged in!');
                app.isLoggedIn = true;
                auth.getUser().then(function(data) {
                    app.firstName = data.data.firstName;
                    app.lastName = data.data.lastName;
                    app.email = data.data.email;
                    app.DOB = data.data.DOB;
                    app._id = data.data._id;
                    if(location.href == 'http://localhost:8080/login' || location.href == 'http://localhost:8080/register'){
                    $location.path('/')
                    }
                });
        } else {
            console.log('Failure: user is not logged in!');
            app.isLoggedIn= false;
            app.firstName = '';
            if(!(location.href === 'http://localhost:8080/login' || location.href == 'http://localhost:8080/register')) {
                $location.path('/login')
            }
        }
    });

    this.doLogin = function(loginData){
        app.errorMsg = false;
        // console.log('Form Submitted');
        auth.login(app.loginData).then(function(data){
            // console.log(data.data.message);
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $location.path('/')
                    app.loginData = '';
                    app.successMsg = false;
                },3000);
                
            }else{
                app.errorMsg = data.data.message;
            }
        });
    };

    this.logout = function(){
        auth.logout();
        $timeout(function() {
            $location.path('/login');
        }, 2000);
    };

    this.searchValue = '';
    this.searchedData = [];

    this.searchUser = function() {
        $http.post('/api/search', {
            firstName: this.searchValue
        }).then((result) => {
            this.searchedData = result.data;
            console.log(this.searchedData)
        }).catch((err) => {
            console.log(err);
        })
    }
    this.follow = function(followerId,FollowedId, index){
        console.log(this.searchedData[index]);
        $http.post('/api/follow', {
            follower: followerId,
            followed: FollowedId
        }).then((result) => {
            
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }
});