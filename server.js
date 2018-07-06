
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router= express.Router();
var appRoutes= require('./app/routes/api')(router);
var path=require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

mongoose.connect(process.env.MONGODB_URI);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(process.env.PORT, function(err) {
    console.log('Server is listening on port ', process.env.PORT);
});