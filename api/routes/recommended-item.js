'use strict'

var express = require('express');
var RecommendedItemController = require('../controllers/recommended-item');

var api = express.Router();

api.get('/recommendeditems/', RecommendedItemController.listRecommendedItems);

module.exports = api;
