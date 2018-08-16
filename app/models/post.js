
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
    media: {
        filename: String,
        path: String
    }
});

var Post = mongoose.model('post', postSchema);

module.exports = {Post};