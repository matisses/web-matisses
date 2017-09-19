'use strict'

var MenuItem = require('../models/menu-item');
var Vajilla = require('../models/vajilla');
var ObjectId = require('mongoose').Types.ObjectId;

function save(req, res) {
  var vajilla = new Vajilla();
  vajilla.name = req.body.name;
  vajilla.brand = req.body.brand;
  vajilla.coleccion = req.body.coleccion;
  vajilla.photo = req.body.photo;
  vajilla.price = req.body.price;
  vajilla.items = req.body.items;
  vajilla.pieces = req.body.pieces;
  vajilla.detail = [];
  for (var i = 0; i < req.body.detail.length; i++) {
    vajilla.detail.push({
      itemcode: req.body.detail[i].itemcode,
      quantity: req.body.detail[i].quantity
    });
  }

  vajilla.save((err, saved) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'error al crear la vajilla'
      });
    } else if (!saved) {
      res.status(404).send({
        message: 'no se creó la vajilla'
      });
    } else {
      return res.status(200).send(saved);
    }
  });
}

function list(req, res) {
  Vajilla.find({}, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'error al listar las vajillas'
      });
    } else if (!response) {
      res.status(404).send({
        message: 'no se encontraron vajillas'
      });
    } else {
      return res.status(200).send(response);
    }
  });
}

function listItems(req, res) {
  Vajilla.aggregate([{
    $match: {
      _id: ObjectId(req.params._id)
      //_id: req.params._id
    }
  }, {
    $project: {
      detail: 1
    }
  }, {
    $unwind: "$detail"
  }, {
    $lookup: {
      from: "items",
      localField: "detail.itemcode",
      foreignField: "itemcode",
      as: "item"
    }
  }, {
    $unwind: "$item"
  }, {
    $addFields: {
      "item.selectedQuantity": "$detail.quantity"
    }
  }, {
    $project: {
      item: 1
    }
  }], (error, result) => {
    if (error) {
      console.error(err);
      res.status(500).send({
        message: 'error al listar los items de la vajilla'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontraron items para la vajilla'
      });
    } else {
      return res.status(200).send(result);
    }
  });
}

function remove(req, res) {
  Vajilla.findByIdAndRemove({
    _id: ObjectId(req.params._id)
  }, (err, deleted) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'error al eliminar la vajilla'
      });
    } else if (!deleted) {
      res.status(404).send({
        message: 'no se encontró la vajilla'
      });
    } else {
      res.status(200).send({
        vajilla: deleted
      });
    }
  });
}

module.exports = {
  save,
  list,
  listItems,
  remove
};
