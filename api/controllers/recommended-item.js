'use strict'

var RecommendedItem = require('../models/recommended-item');
var jwt = require('../services/jwt');

function listRecommendedItems(req, res) {
  var find = RecommendedItem.find({
    active: true
  }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar los ítems recomendados'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún ítem recomendado'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).populate({path: 'itemId'});
}

module.exports = {
  listRecommendedItems
};
