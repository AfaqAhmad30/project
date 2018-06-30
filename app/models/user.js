var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    password: String
});

var User = mongoose.model('user', userSchema);

module.exports = {User};