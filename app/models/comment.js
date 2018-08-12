var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    commentedOn: {
        type: Date
    },
    commentedText: {
        type: String
    }
});

var Comment = mongoose.model('comment', commentSchema);

module.exports = {Comment};