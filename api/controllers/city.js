'use strict'

var City = require('../models/city');
//var State = require('../models/states');
var jwt = require('../services/jwt');

function listPrincipalCities(req, res) {
  City.find({
    code: /001$/
  }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar las ciudades principales'
      });
    } else {
      if (!result) {
        res.status(404).send({
          message: 'no se encontró ninguna ciudad principal'
        });
      } else {
        res.status(200).send({
          cities: result
        });
      }
    }
  }).sort({
    name: 1
  });
}

function listOtherCities(req, res) {
  City.find({
    code: {
      $not: /001$/
    }
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar las otras ciudades'
      });
    } else {
      if (!result) {
        res.status(404).send({
          message: 'no se encontró ninguna otra ciudad'
        });
      } else {
        res.status(200).send({
          cities: result
        });
      }
    }
  }).sort({
    name: 1
  });
}

module.exports = {
  listPrincipalCities,
  listOtherCities
};
