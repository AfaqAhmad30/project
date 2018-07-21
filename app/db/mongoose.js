const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.conn = mongoose.createConnection(process.env.MONGODB_URI);

module.exports = {mongoose};