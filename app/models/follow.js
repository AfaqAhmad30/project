var mongoose = require('mongoose');
var Schema =   mongoose.Schema;

var followSchema = new Schema({

follower:   {   type: Schema.Types.ObjectId,
                ref: 'user'
            },
following:  {   type: Schema.Types.ObjectId,
                ref: 'user'
            }         
});

module.exports =  mongoose.model('follow', followSchema);