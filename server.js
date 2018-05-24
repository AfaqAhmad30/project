var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router= express.Router();
var appRoutes= require('./app/routes/api')(router);
var path=require('path');


var port = process.env.PORT || 8080;
var url = 'mongodb://localhost:27017/projectDB';


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);


mongoose.connect(url, function(err) {
    if(err) {
        console.log('Not connected to mongodb', err);
    } else {
        console.log('Connected to mongodb');
    }
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(err) {
    console.log('Server is listening on port ', port);
});