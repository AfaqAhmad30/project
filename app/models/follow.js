var mongoose = require('mongoose');
var Schema =   mongoose.Schema;

var followSchema = new Schema({
    followed : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    follower : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }  
});

//followSchema.index({'follower': 1, 'followed': 1}, {'unique': true});

var Follow =  mongoose.model('follow', followSchema);

module.exports = {Follow};