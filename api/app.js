'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var itemRoutes = require('./routes/item');
var menuItemRoutes = require('./routes/menu-item');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api/item', itemRoutes);
app.use('/api/menuitem', menuItemRoutes);

module.exports = app;
