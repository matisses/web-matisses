'use strict'

var MenuItem = require('../models/menu-item');
var Item = require('../models/item');
var ObjectId = require('mongoose').Types.ObjectId;

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

function edit(req, res) {
  var menuItem = req.body;

  MenuItem.findByIdAndUpdate(menuItem._id, menuItem, (err, updated) => {
    if (err) {
      res.status(500).send({
        message: 'error al actualizar el menú'
      });
    } else if (!updated) {
      res.status(404).send({
        message: 'no se actualizó el menú'
      });
    } else {
      return res.status(200).send({
        menuItem: updated
      });
    }
  });
}

function save(req, res) {
  var menuItem = new MenuItem();
  menuItem.name = req.body.name;
  menuItem.parentId = req.body.parentId;
  menuItem.group = req.body.group;
  menuItem.subgroup = req.body.subgroup;
  menuItem.menuItemAfter = req.body.menuItemAfter;
  menuItem.menuItemBefore = req.body.menuItemBefore;

  menuItem.save((err, saved) => {
    if (err) {
      //console.error(err);
      res.status(500).send({
        message: 'error al crear el menú'
      });
    } else if (!saved) {
      res.status(404).send({
        message: 'no se creó el menú'
      });
    } else {
      return res.status(200).send({
        menuItem: saved
      });
    }
  });
}

function remove(req, res) {
  var menuId = req.params.id;

  MenuItem.findByIdAndRemove(menuId, (err, deleted) => {
    if (err) {
      res.status(500).send({
        message: 'error al eliminar el menú'
      });
    } else if (!deleted) {
      res.status(404).send({
        message: 'no se eliminó el menú'
      });
    } else {
      res.status(200).send({
        menuItem: deleted
      });
    }
  });
}

function loadMenuRecursively(req, res) {
  var menuItems = [];
  executeRecursion(req.params.id, null, menuItems, req.headers.authorization, res);
}

function executeRecursion(parentId, idBefore, itemsArray, token, res) {
  MenuItem.find({
    $and: [{
      parentId: parentId,
      menuItemBefore: idBefore
    }, {
      menuItemBefore: {
        $exists: true
      }
    }]
  }, (err, resp) => {
    if (err) {
      res.status(200).send({
        result: itemsArray
      });
    } else if (resp && resp.length > 0) {
      //validar que existan items con saldo en las categorias del menu
      if ((resp[0].subgroup || resp[0].group) && !token) {
        var groups = resp[0].group ? resp[0].group.split(',') : [];
        var subgroups = resp[0].subgroup ? resp[0].subgroup.split(',') : [];
        Item.count({
          $and: [{
            $or: [{
              "subgroup.code": {
                $in: subgroups
              }
            }, {
              "group.code": {
                $in: groups
              }
            }]
          }, {
            availablestock: {
              $gt: 0
            }
          }]
        }, (error, count) => {
          if (count > 0) {
            itemsArray.push(resp[0]);
            if (resp[0].menuItemAfter && resp[0].menuItemAfter != null) {
              executeRecursion(parentId, resp[0]._id, itemsArray, token, res);
            } else {
              res.status(200).send({
                result: itemsArray
              });
            }
          } else {
            if(error){
              console.error(error);
            }
            res.status(200).send({
              result: itemsArray
            });
          }
        });
      } else {
        itemsArray.push(resp[0]);
        //Carga el menu hermano siguiente
        if (resp[0].menuItemAfter && resp[0].menuItemAfter != null) {
          executeRecursion(parentId, resp[0]._id, itemsArray, token, res);
        } else {
          //No hay mas hermanos, retorna
          res.status(200).send({
            result: itemsArray
          });
        }
      }
    } else {
      res.status(200).send({
        result: itemsArray
      });
    }
  });
}

module.exports = {
  listMenuItems,
  edit,
  save,
  remove,
  loadMenuRecursively
};
