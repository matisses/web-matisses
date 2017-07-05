'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var itemRoutes = require('./routes/item');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', itemRoutes);

module.exports = app;

