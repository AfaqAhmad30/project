var mongoose = require('mongoose');

var Schema = mongoose.Schema;

notificationSchema = Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    actionUserId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    action: {
        type: String,
    },
    time: {
        type: Date
    }
});

var Notification = mongoose.model('notification', notificationSchema);

module.exports = {Notification};