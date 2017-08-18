'use strict'

var RecommendedItem = require('../models/recommended-item');
var jwt = require('../services/jwt');

function listRecommendedItems(req, res) {
  RecommendedItem.aggregate([{
      "$match": {
        "active": true
      }
    },
    {
      "$lookup": {
        "from": "items",
        "localField": "itemcode",
        "foreignField": "itemcode",
        "as": "item_data"
      }
    },
    {
      "$project": {
        "item_data": 1
      }
    },
    {
      "$unwind": {
        "path": "$item_data"
      }
    }
  ], (err, result) => {
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
  });
}

module.exports = {
  listRecommendedItems
};
