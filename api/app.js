'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var itemRoutes = require('./routes/item');
var menuItemRoutes = require('./routes/menu-item');
var recommendedItemRoutes = require('./routes/recommended-item');
var stockRoutes = require('./routes/stock');
var cityRoutes = require('./routes/city');
var shoppingCartRoutes = require('./routes/shopping-cart');
var crockerytRoutes = require('./routes/vajilla');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/api/item', itemRoutes);
app.use('/api/menuitem', menuItemRoutes);
app.use('/api/recommendeditem', recommendedItemRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/shoppingcart', shoppingCartRoutes);
app.use('/api/crockery', crockerytRoutes);

module.exports = app;
