

var {Post} = require('../models/post');
var {Comment} = require('../models/comment');
var {Like} = require('../models/like');

var {Follow} = require('../models/follow');
var user = require('../models/users');

var jwt  =    require('jsonwebtoken');
var secret = 'mySecret';

var multer = require('multer');


// Multer disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/media')
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
        uzer.fullName = req.body.firstName +' '+ req.body.lastName;
        uzer.DOB = req.body.DOB;
        uzer.email    = req.body.email;
        uzer.password = req.body.password;
        uzer.password2 = req.body.password2;
        uzer.joinedDate = new Date().getTime();

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
        user.findOne({ email: req.body.email }).exec(function(err,user)
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
                    console.log(user);
                    var token = jwt.sign({
                        user: user,
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

    // Adding new post without picture to user timeline
    router.post('/newPostWithoutPic', (req, res) => {
        var post = new Post();
        post.author = req.body.newPost.author;
        post.time = new Date().getTime();
        post.description = req.body.newPost.description;
        
        post.save().then((result) => {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });

    // delete post
    router.post('/post/deletePost', (req, res) => {
        console.log(req.body);
        Post.findByIdAndRemove(req.body._id).then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });

    var ids = [];
    // Get all post to timeline
    router.post('/posts', (req, res) => {
        if(req.body.page === 'home') {
            Follow.find({follower: req.body.author}).select('followed -_id').exec().then((userIds) =>{
                userIds.forEach(function(user) {
                    ids.push(user.followed.toString());
                })
                ids.push(req.body.author);
                
            });
        } else {
            ids = [];
            ids.push(req.body.author);
        }
        Post.find({author: ids}).populate('author', 'fullName profile').sort({time: -1}).exec().then((posts) => {
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

    // update user profile
    router.post('/updateUserProfile', (req, res) => {
        user.findOneAndUpdate({_id: req.body._id}, {$set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fullName: req.body.firstName + ' ' + req.body.lastName,
            DOB: req.body.DOB,
            email: req.body.email,
            phone: req.body.phone,
            education: req.body.education,
            currentLoc: req.body.currentLoc,
            hometown: req.body.hometown,
            work: req.body.work,
            status: req.body.status
        }}, {new: true}).then((resp) => {
            res.json({message: 'updated'});
        }).catch((err) => {
            res.json(err);
        });
    });

    // update profile picture
    router.post('/updateDP', upload.single('file'), (req, res) => {
        user.findOneAndUpdate({_id: req.body.userId}, {$set: {profile: req.file.filename}}, {new: true}).then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });

    // update cover picture
    router.post('/updateCover', upload.single('file'), (req, res) => {
        user.findOneAndUpdate({_id: req.body.userId}, {$set: {cover: req.file.filename}}, {new: true}).then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });

    //Search Users
    router.post('/search', function(req, res){
        user.find({ fullName: { $regex: req.body.searchValue, $options: 'i' }}).sort('fullName').exec().then((result) => {
            res.json(result);
        }, (err) => {
            res.json(err);
        });
    });

    // User follow or unfollow someone
    router.post('/follow', function(req,res){
        Follow.findOne({followed: req.body.followed, follower: req.body.follower}).exec().then((resp) => {
            if(resp) {
                // means user already following
                // so change to unfollow him/her
                Follow.findOneAndRemove({followed: req.body.followed, follower: req.body.follower}).then((result) => {
                    res.json({message: 'unfollow'});
                })
            } else {
                // user not following
                // so change it to follow him/her
                var follow = new Follow();
                follow.follower = req.body.follower;
                follow.followed = req.body.followed;
                follow.save().then((result) => {
                    res.json({message: 'follow'});
                })
            }
        }).catch((err) => {
            res.json(err);
        });
    });


    // check is user following
    // use for follow unfollow button
    router.post('/isFollowed', (req, res) => {
        Follow.findOne({followed: req.body.followed, follower: req.body.follower}).exec().then((resp) => {
            if(resp) {
                res.json({message: 'yes'});
            } else {
                res.json({message: 'no'});
            }
        }).catch((err) => {
            res.json(err);
        });
    });


    // get the users that you follow
    router.post('/getFollowing', (req, res) => {
        Follow.find({follower: req.body.follower}).populate('followed').sort({_id: -1}).exec().then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });


    // get the followers
    router.post('/getFollower', (req, res) => {
        Follow.find({followed: req.body.followed}).populate('follower').sort({_id: -1}).exec().then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });


    // get totalFollower for login user
    router.post('/totalFollowers', (req, res) =>{
        Follow.find({followed: req.body.userId}).exec().then((followers) => {
            res.json(followers.length);
        }).catch((err) => {
            res.json(err);
        });
    });

    // get totalFollowing for login user
    router.post('/totalFollowing', (req, res) =>{
        Follow.find({follower: req.body.userId}).exec().then((followed) => {
            res.json(followed.length);
        }).catch((err) => {
            res.json(err);
        });
    });

    // get user posts images
    router.post('/getPostsImages', (req, res) => {
        Post.find({author: req.body.author}).select('media').sort({_id: -1}).exec().then((posts) => {
            res.json(posts);
        }).catch((err) => {
            res.json(err);
        });
    });


    // User like or unlike a post
    router.post('/postLiked', (req, res) => {
        Like.findOne({postId: req.body.postId, userId: req.body.userId}).exec().then((result) => {
            if(result) {
                Like.findByIdAndRemove(result._id).exec().then((unlike) => {
                    res.json({message: 'post unlike'});
                });
            } else {
                var like = new Like();
                like.postId = req.body.postId;
                like.userId = req.body.userId;
                like.save().then((like) => {
                    res.json({message: 'post like'});
                });
            }
        }).catch((err) => {
            res.json({message: 'Error in post like'});
        })
    });

    // get total likes for a post
    router.post('/post/getLikes', (req, res) => {
        Like.find({postId: req.body.postId}).exec().then((result) => {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });

    // posted new comment to user post
    router.post('/post/newComment', (req, res) => {
        var comment = new Comment();
        comment.postId = req.body.postId;
        comment.userId = req.body.userId;
        comment.commentedOn = new Date().getTime();
        comment.commentedText = req.body.commentedText;

        comment.save().then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });

    // get all the comments for a post
    router.post('/post/getComments', (req, res) => {
        Comment.find({postId: req.body.postId}).populate('userId', 'firstName lastName profile').exec().then((comments) => {
            res.json(comments);
        }).catch((err) => {
            res.json(err);
        });
    });

    router.post('/post/getComment', (req, res) => {
        Comment.findById(req.body._id).populate('userId', 'firstName lastName').exec().then((comment) => {
            res.json(comment);
        }).catch((err) => {
            res.json(err);
        });
    });

    router.post('/post/deleteComment', (req, res) => {
        Comment.findByIdAndRemove(req.body._id).then((resp) => {
            res.json(resp);
        }).catch((err) => {
            res.json(err);
        });
    });

    return router;
};