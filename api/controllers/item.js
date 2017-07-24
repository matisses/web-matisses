'use strict'

//Librerias para manejo de archivos (FileSystem)
//var fs = require('fs');
//var path = require('path');

//Librerias para acceso a MongoDB
//var mongoosePaginate = require('mongoose-pagination');

//Modelo
var Item = require('../models/item');

function consultar(req, res) {
  console.log('consultando item(s) ' + req.params.referencia);

  res.status(200).send({
    message: 'prueba exitosa'
  });
}

function consultarNuevos(req, res) {
  console.log('consultando items nuevos');

  Item.find({

  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar los productos nuevos'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún producto nuevo'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).sort('-newfrom').limit(10);
}

module.exports = {
  consultar,
  consultarNuevos
};
