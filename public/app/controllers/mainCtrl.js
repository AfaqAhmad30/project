 angular.module('mainController', ['authServices'])
.controller('mainCtrl', function(auth, $timeout, $location, $rootScope, $http){
    var app = this;

    app.a = [1, 2, 3, 4];

    app.doActive = function(loc) {
        var a = angular.element( document.querySelector( '.homeLoc' ) );
        var b = angular.element( document.querySelector( '.msgLoc' ) );
        var c = angular.element( document.querySelector( '.proLoc' ) );
        if(loc === 'home') {
            a.addClass('makeActive');
            b.removeClass('makeActive');
            c.removeClass('makeActive');
        } else if(loc === 'messages') {
            a.removeClass('makeActive');
            b.addClass('makeActive');
            c.removeClass('makeActive');
        } else if(loc === 'profile') {
            a.removeClass('makeActive');
            b.removeClass('makeActive');
            c.addClass('makeActive');
        } else {
            a.removeClass('makeActive');
            b.removeClass('makeActive');
            c.removeClass('makeActive');
        }

    };

    $rootScope.$on('$routeChangeStart', function() {
        if(auth.isLoggedIn()) {
            console.log('Success: user is logged in!');
                app.isLoggedIn = true;
                auth.getUser().then(function(data) {
                    app.loginUser = data.data.user;
                    app.firstName = data.data.firstName;
                    app.lastName = data.data.lastName;
                    app.email = data.data.email;
                    app._id = data.data._id;
                    $rootScope.loginUserId = app.loginUser._id;
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
        if($location.url() === '/search') {
            app.doActive('');
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
    this.searchedValue= '';
    this.searchedData = [];

    this.searchUser = function() {
        if(!(this.searchValue === '')) {
            this.searchedValue = this.searchValue;
            $http.post('/api/search', {
                searchValue: this.searchValue
            }).then((result) => {
                result.data.forEach(user => {
                    $http.post('/api/isFollowed', {followed: user._id, follower: app._id}).then((result) => {
                        if(result.data.message === 'yes') {
                            user.followed = 'Following';
                        } else {
                            user.followed = 'Follow';
                        }
                    });
                });
                this.searchedData = result.data;
                this.searchValue = '';
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    this.follow = function(followerId, followedId, index){
        $http.post('/api/follow', {
            follower: followerId,
            followed: followedId
        }).then((result) => {
            if(result.data.message === 'follow') {
                this.searchedData[index].followed = 'Following';
            } else {
                this.searchedData[index].followed = 'Follow';
            }
        }).catch((err) => {
            console.log(err);
        });
    }
});