'use strict'

var express = require('express');
var ItemController = require('../controllers/item');

var api = express.Router();

api.get('/nuevos/', ItemController.consultarNuevos);
api.get('/filtrar/', ItemController.filtrar);
api.get('/consultarfiltros/', ItemController.consultarFiltros);
api.get('/consultargrupo/', ItemController.consultarGrupo);
api.get('/consultarsubgrupo/', ItemController.consultarSubgrupo);
api.get('/consultarmarca/', ItemController.consultarMarca);
api.get('/consultarcolor/', ItemController.consultarColor);
api.get('/consultarmaterial/', ItemController.consultarMaterial);
api.get('/consultaritem/:itemcode', ItemController.consultarItem);
api.get('/obtenerrelacionados/:model', ItemController.obtenerRelacionados);

module.exports = api;
