var mongoose = require('mongoose');
var Schema =   mongoose.Schema;
var bcrypt =   require('bcrypt-nodejs');

var userSchema = new Schema({
firstName:   { type: String, required: true},
lastName:    { type: String, required: true},
DOB:         { type: Date, required: true},
email:       { trim: true, type: String, required: true, unique: true},
password:    { type: String, required: true}
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