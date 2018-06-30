var user = require('../models/users');
var jwt  = require('jsonwebtoken');
var secret = 'mySecret';
module.exports = function(router) {

    // All the routes will define here...
    router.post('/users', function(req,res){
        var uzer = new user();
        uzer.firstName = req.body.firstName;
        uzer.lastName = req.body.lastName;
        uzer.DOB = req.body.DOB;
        uzer.email    = req.body.email;
        uzer.password = req.body.password;
        uzer.password2 = req.body.password2;

        if(req.body.firstName == '' || req.body.firstName == null || req.body.lastName == '' || req.body.lastName == null || req.body.DOB == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '' || req.body.password2 == null || req.body.password2 == '')
            {
                res.json({success: false, message: 'please provide data in all fields'});
            }else 
            if(req.body.password !== req.body.password2){
                res.json({success: false, message: 'Passwords are not Mactching'});
            }
            else
            { uzer.save(function(err){
            if(err){
                res.json({success: false, message: 'Duplicate Data'});
            }else{
                res.json({success: true, message: 'User created'});
            }
        });
            }
    });

    //user Login Route
    router.post('/authenticate', function(req, res){
        user.findOne({ email: req.body.email }). select('firstName email password').exec(function(err,user)
        {
            if(err) throw err;

            if(!user)
            { res.json({success: false, message: 'User not available'}); 
        } else if(user){
            if(req.body.password){
            var validPassword = user.comparePassword(req.body.password);
            } else{
                res.json({success: false, message:'password not provided'})
            }if(!validPassword){
                res.json({success: false, message: 'invalid password'})
            }else{
                var token = jwt.sign({firstName: user.firstName, email: user.email}, secret, {expiresIn: '24h'});
                res.json({success: true, message: 'user Authenticated successfully', token: token})
            }

        }
        });
    });

    router.get('/logout', function(req, res){
        if(user.isloggedIn)
        {
        req.logout();
        } else {
            user.successMsg = data.data.message;
            $timeout(function(){
                $location.path('/index')
                app.loginData = '';
                app.successMsg = false;
            },3000);
        }
    });
        router.use(function(req, res, next){
            var token = req.body.token || req.body.query || req.headers['x-access-token'];
            if(token){
                jwt.verify(token, secret, function(err, decoded){
                    if(err) {
                        res.json({success: false, message: 'token invalid'});
                    }else {
                        req.decoded = decoded;
                        next();
                    }
                });
            }else{
                res.json({success: false, message:'error eroor'});
            }
        });
        router.post('/crntUser', function(req, res){
            res.send(req.decoded);
        });
    return router;
};