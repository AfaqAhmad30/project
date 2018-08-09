
var {Post} = require('../models/post');
var multer = require('multer');

var user = require('../models/users');
var jwt  =    require('jsonwebtoken');
var secret = 'mySecret';
var follow = require('../models/follow');

// Multer disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './app/media')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ storage: storage });


module.exports = function(router) {
    // All the routes will define here...

    // Registering new user
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
                res.json({success: false, message: 'Passwords are not Matching'});
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
        user.findOne({ email: req.body.email }).select('_id firstName lastName email password').exec(function(err,user)
        {
            if(err) throw err;

            if(!user) {
                res.json({success: false, message: 'User not available'}); 
            } else if(user) {
                if(req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({success: false, message:'password not provided'})
                }
                if(!validPassword) {
                    res.json({success: false, message: 'invalid password'})
                } else {
                    var token = jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        _id: user._id
                    }, secret, {expiresIn: '24h'});
                    res.json({success: true, message: 'user Authenticated successfully', token: token})
                }
            }
        });
    });

    // Adding new post to user timeline
    router.post('/newPost', upload.single('file'), (req, res) => {
        var post = new Post();
        post.author = req.body.newPost.author;
        post.media.filename = req.file.filename;
        post.media.path = req.file.path;
        post.time = new Date().getTime();
        post.description = req.body.newPost.description;
        
        post.save().then((result) => {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });


    // Get all post to timeline
    router.post('/posts', (req, res) => {
        Post.find({author: req.body.author}).populate('author', 'firstName lastName').sort({time: -1}).exec().then((posts) => {
            res.json(posts);
        }).catch((err) => {
            res.json(err);
        });
    });

    // Middleware for token
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
            res.json({success: false, message:'error'});
        }
    });

    // Send token data of logged In user
    router.post('/crntUser', function(req, res){
        res.send(req.decoded);
    });
    
    // Get user profile details
    router.post('/getProfileDetails', function(req, res) {
        user.findById({_id: req.body.userProfileId}).then(function(result) {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });
    //Search Users
    router.post('/search', function(req, res){
        user.find({ firstName:{ $regex: req.body.firstName, $options: 'i' }}).exec().then((result) => {
            res.json(result);
        }, (err) => {
            res.json(err);
        });
    });

    router.post('/follow', function(req,res){
        var fol = new follow();
        fol.follower = req.body.follower;
        fol.following = req.body.following;
        fol.save().then((result) => {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });

    return router;
};