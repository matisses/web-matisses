'use strict'

var ShoppingCart = require('../models/shopping-cart');

function saveShoppingCart(req, res) {
  var shoppingCart = new ShoppingCart();
  var params = req.body;

  console.log(params);

  shoppingCart.fechacreacion = new Date();
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

module.exports = {
  saveShoppingCart
};
