var mongoose = require('mongoose');
var Schema =   mongoose.Schema;
var bcrypt =   require('bcrypt-nodejs');

var userSchema = new Schema({
firstName:      {type: String, required: true},
lastName:       {type: String, required: true},
fullName:       {type: String},
DOB:            {type: Date, required: true},
email:          {trim: true, type: String, required: true, unique: true},
password:       {type: String, required: true},
phone:          {type: String},
profile:        {type: String},
cover:          {type: String},
hometown:       {type: String},
currentLoc:     {type: String},
education:      {type: String},
work:           {type: String, default: 'not provided'},
status:         {type: String, default: 'Hey there! I am using vTrans, a social network for Transgender'},
joinedDate:     {type: Date}
});

userSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password,null,null,function(err,hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports =  mongoose.model('user', userSchema);