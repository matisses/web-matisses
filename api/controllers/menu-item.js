'use strict'

var MenuItem = require('../models/menu-item');
var jwt = require('../services/jwt');

function listMenuItems(req, res) {
  var find = MenuItem.find({
    parentId: req.params.parentId
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar el menu'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún menu'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).sort('position');
}

module.exports = {
  listMenuItems
};
