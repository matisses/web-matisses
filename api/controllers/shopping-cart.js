'use strict'

var ShoppingCart = require('../models/shopping-cart');

function saveShoppingCart(req, res) {
  var shoppingCart = new ShoppingCart();
  var params = req.body;

  shoppingCart.metodoEnvio = params.metodoEnvio;
  shoppingCart.tiendaRecoge = params.tiendaRecoge;
  shoppingCart.fechacreacion = new Date();
  shoppingCart.precioNuevo = params.precioNuevo;
  shoppingCart.items = params.items;

  shoppingCart.save((err, shoppingCartStored) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al guardar los datos del carrito'
      });
    } else {
      if (!shoppingCartStored) {
        res.status(404).send({
          message: 'no se pudo guardar el carrito en la BD'
        });
      } else {
        return res.status(200).send({
          shoppingCart: shoppingCartStored
        });
      }
    }
  });
}

function findShoppingCart(req, res) {
  var origin = req.params.origin;

  ShoppingCart.find({
    "_id": req.params.id
  }, (err, shoppingCart) => {
    if (err) {
      console.error(error);
      res.status(500).send({
        message: 'ocurrio un error al consultar el carrito'
      });
    } else if (!shoppingCart) {
      res.status(404).send({
        message: 'no se encontró el carrito con id ' + req.query.id
      });
    } else {
      if (origin && origin === 'BCS') {
        res.status(200).send(shoppingCart[0]);
      } else {
        res.status(200).send({
          shoppingCart: shoppingCart
        });
      }
    }
  })
}

module.exports = {
  saveShoppingCart,
  findShoppingCart
};
