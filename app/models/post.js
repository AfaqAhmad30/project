
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var postSchema = Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    time: {
        type: Date,
    },
    description: {
        type: String
    },
    media: [{
        type: Schema.Types.ObjectId,
        default: []
    }],
    likes: {
        type: Number,
        default: 0
    }
    
});

var Post = mongoose.model('post', postSchema);

module.exports = {Post};