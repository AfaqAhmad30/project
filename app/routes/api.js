
var {User} = require('../models/user');
var {Post} = require('../models/post');
var {upload} = require('../../app/config/GridFS');


module.exports = function(router) {
    // All the routes will define here...

    router.post('/posts', upload.single('file'), (req, res) => {
        console.log(req.body);
        var post = new Post();
        post.author = req.body.author;
        post.media = req.body.media;
        post.time = new Date().getTime();
        post.description = req.body.description;
        
        post.save().then((result) => {
            res.json(result);
        }).catch((err) => {
            res.json(err);
        });
    });

    // Get all post to timeline
    router.get('/posts', (req, res) => {
        Post.find({}).populate('author', 'fullName').sort({time: -1}).exec().then((posts) => {
            res.json(posts);
        }).catch((err) => {
            res.json(err);
        });
    });
  
    return router;
};