'use strict'

//Librerias para acceso a MongoDB
var mongoosePaginate = require('mongoose-pagination');

//Modelo
var Stock = require('../models/stock');

function consultarStockItem(req, res) {
  var itemcode = '';
  if (req.params.itemcode.length < 20) {
    itemcode = req.params.itemcode.substring(0, 3) + '0000000000000' + req.params.itemcode.substring(3);
  } else {
    itemcode = req.params.itemcode;
  }

  Stock.find({
    "itemCode": itemcode,
    "quantity": {$gt: 0}
  }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar el stock para el item ' + itemcode
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún stock para el itemcode ' + itemcode
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  });
}

module.exports = {
  consultarStockItem
};
