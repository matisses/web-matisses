'use strict'

//Librerias para acceso a MongoDB
var mongoosePaginate = require('mongoose-pagination');

//Modelo
var Stock = require('../models/stock');

function consultarStockItem(req, res) {
  var itemcode = req.params.itemcode.substring(0, 3) + '0000000000000' + req.params.itemcode.substring(3);

  Stock.find({
    "itemCode": itemcode
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar el stock para el item ' + itemcode
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún stock para el itemcode ' + itemcode
      });
    } else {
      console.log(result);
      res.status(200).send({
        result: result
      });
    }
  });
}

module.exports = {
  consultarStockItem
};
