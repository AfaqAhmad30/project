const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var likeSchema = Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

var Like = mongoose.model('like', likeSchema);

module.exports = {Like};