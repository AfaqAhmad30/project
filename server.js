require('./app/config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router= express.Router();
const appRoutes= require('./app/routes/api')(router);
const path=require('path');


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