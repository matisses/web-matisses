'use strict'

//Librerias para manejo de archivos (FileSystem)
//var fs = require('fs');
//var path = require('path');

//Librerias para acceso a MongoDB
var mongoosePaginate = require('mongoose-pagination');

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

function filtrar(req, res) {
  console.log(req.query);
  var page = req.query.page;
  var pageSize = req.query.pageSize;
  var orderBy = req.query.orderBy;
  var department = req.query.department;
  var group = req.query.group;
  var subgroup = req.query.subgroup;

  var filterObject = {};
  if (typeof page == 'undefined' || page == null) {
    page = 1;
  } else {
    page = parseInt(page);
  }
  if (typeof pageSize == 'undefined' || pageSize == null) {
    pageSize = 12;
  } else {
    pageSize = parseInt(pageSize);
  }
  if (typeof orderBy == 'undefined' || orderBy == null) {
    orderBy = 'model';
  }
  if (typeof department != 'undefined' && department != null) {
    filterObject.department = department;
  }
  if (typeof group != 'undefined' && group != null) {
    filterObject.group = group;
  }
  if (typeof subgroup != 'undefined' && subgroup != null) {
    filterObject.subgroup = subgroup;
  }

  Item.find(filterObject).count({}, (errorCount, count) => {
    if (errorCount) {
      console.error(errorCount);
    } else {
      Item.find(filterObject, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'ocurrio un error al consultar los productos'
          });
        } else if (!result) {
          res.status(404).send({
            message: 'no se encontró ningún producto con los filtros especificados'
          });
        } else {
          res.status(200).send({
            records: count,
            result: result
          });
        }
      }).sort(orderBy).paginate(page, pageSize);
    }
  });
}


module.exports = {
  consultar,
  consultarNuevos,
  filtrar
};
