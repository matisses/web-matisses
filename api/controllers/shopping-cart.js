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

function findShoppingCart(req, res) {
  console.log(req.params.id);
  ShoppingCart.find({
    "_id": req.params.id
  }, (err, shoppingCart) => {
    if(err){
      console.log(error);
      res.status(500).send({
        message: 'ocurrio un error al consultar el carrito'
      });
    } else if(!shoppingCart){
      console.log(shoppingCart);
      res.status(404).send({
        message: 'no se encontró el carrito con id ' + req.query.id
      });
    } else {
      console.log(shoppingCart);
      res.status(200).send({
        shoppingCart: shoppingCart
      });
    }
  })
}

module.exports = {
  saveShoppingCart,
  findShoppingCart
};