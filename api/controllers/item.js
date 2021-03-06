'use strict'

//Librerias para acceso a MongoDB
var mongoosePaginate = require('mongoose-pagination');

//Modelo
var Item = require('../models/item');
var Brand = require('../models/brand');
var Color = require('../models/genericcolor');
var Material = require('../models/material');

function consultarItem(req, res) {
  Item.find({
    "shortitemcode": req.params.itemcode
  }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar el producto'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún producto con el itemcode ' + req.query.itemcode
      });
    } else {
      console.log(result);
      res.status(200).send({
        result: result
      });
    }
  });
}

function consultarNuevos(req, res) {
  Item.find({
    availablestock: {
      $gt: 0
    }
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar los productos nuevos'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún producto nuevo'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).sort('-newfrom').limit(10);
}

function armarFilterObject(req) {
  var group = req.query.group;
  var subgroup = req.query.subgroup;
  var brand = req.query.brand;
  var color = req.query.color;
  var material = req.query.material;
  var collection = req.query.collection;
  var minPrice = req.query.minPrice;
  var maxPrice = req.query.maxPrice;
  var keywords = req.query.keywords;
  var discount = req.query.discount;

  var filterObject = {
    availablestock: {
      $gt: 0
    },
    images: {
      $exists: true,
      $not: {
        $size: 0
      }
    }
  };
  if (typeof group != 'undefined' && group != null) {
    filterObject['group.code'] = {
      $in: group.split(',')
    };
  }
  if (typeof subgroup != 'undefined' && subgroup != null) {
    filterObject['subgroup.code'] = {
      $in: subgroup.split(',')
    };
  }
  if (typeof brand != 'undefined' && brand != null) {
    filterObject['brand.code'] = brand;
  }
  if (typeof color != 'undefined' && color != null) {
    filterObject['color.genericcolor.code'] = color;
  }
  if (typeof material != 'undefined' && material != null) {
    filterObject['materials.code'] = material;
  }
  if (typeof collection != 'undefined' && collection != null) {
    filterObject['collection'] = collection;
  }
  if (typeof minPrice != 'undefined' && minPrice != null) {
    filterObject['$and'] = [{
      priceaftervat: {
        $gte: parseInt(minPrice)
      }
    }];
  }
  if (typeof maxPrice != 'undefined' && maxPrice != null) {
    if (typeof minPrice != 'undefined' && minPrice != null) {
      filterObject['$and'].push({
        priceaftervat: {
          $lte: parseInt(maxPrice)
        }
      });
    } else {
      filterObject['$and'] = [{
        priceaftervat: {
          $lte: parseInt(maxPrice)
        }
      }];
    }
  }
  if (typeof keywords != 'undefined' && keywords != null) {
    filterObject['$text'] = {
      $search: keywords
    }
  }
  if (typeof discount != 'undefined' && discount != null) {
    filterObject['discount'] = true;
  }
  return filterObject;
}

function filtrar(req, res) {
  var page = req.query.page;
  var pageSize = req.query.pageSize;
  var orderBy = req.query.orderBy;

  if (typeof page == 'undefined' || page == null) {
    page = 1;
  } else {
    page = parseInt(page);
  }
  if (typeof pageSize == 'undefined' || pageSize == null) {
    pageSize = 12;
  } else {
    pageSize = parseInt(pageSize);
  }
  if (typeof orderBy == 'undefined' || orderBy == null) {
    if (req.query.keywords) {
      orderBy = {
        score: {
          $meta: "textScore"
        }
      };
    } else {
      orderBy = 'model';
    }
  } else if (orderBy === 'price') {
    orderBy = 'priceaftervat';
  } else if (orderBy === '-price') {
    orderBy = '-priceaftervat';
  }

  var filterObject = armarFilterObject(req);
  Item.find(filterObject).count({}, (errorCount, count) => {
    if (errorCount) {
      console.error(errorCount);
    } else {
      Item.find(filterObject, {
        score: {
          $meta: "textScore"
        }
      }, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'ocurrio un error al consultar los productos',
            error: err
          });
        } else if (!result) {
          res.status(404).send({
            message: 'no se encontró ningún producto con los filtros especificados'
          });
        } else {
          res.status(200).send({
            records: count,
            result: result
          });
        }
      }).sort(orderBy).paginate(page, pageSize);
    }
  });
}

function consultarFiltros(req, res) {
  var resultados = {};
  var filterObject = armarFilterObject(req);
  //consulta los departamentos
  Item.aggregate([{
      "$match": filterObject
    },
    {
      "$group": {
        "_id": {
          "group": "$group"
        }
      }
    },
    {
      "$sort": {
        "_id.group.name": 1
      }
    }
  ], (err1, result1) => {
    if (err1) {
      console.error(err1);
      res.status(500).send({
        message: 'ocurrio un error al consultar los filtros (grupo)'
      });
    } else if (!result1) {
      res.status(404).send({
        message: 'no se obtuvieron resultados con los filtros especificados'
      });
    } else {
      //Obtuvo resultados para grupo, continua con subgrupo
      resultados['groups'] = [];
      for (var i = 0; i < result1.length; i++) {
        resultados['groups'].push({
          code: result1[i]._id.group.code,
          name: result1[i]._id.group.name
        });
      }
      Item.aggregate([{
          "$match": filterObject
        },
        {
          "$group": {
            "_id": {
              "subgroup": "$subgroup"
            }
          }
        },
        {
          "$sort": {
            "_id.subgroup.name": 1
          }
        }
      ], (err2, result2) => {
        if (err2) {
          console.error(err2);
          res.status(500).send({
            message: 'ocurrio un error al consultar los filtros (subgrupo)'
          });
        } else if (!result2) {
          res.status(404).send({
            message: 'no se obtuvieron resultados con los filtros especificados'
          });
        } else {
          //Obtuvo resultados para subgrupo, consulta marcas
          resultados['subgroups'] = [];
          for (var i = 0; i < result2.length; i++) {
            resultados['subgroups'].push({
              code: result2[i]._id.subgroup.code,
              name: result2[i]._id.subgroup.name
            });
          }
          Item.aggregate([{
              "$match": filterObject
            },
            {
              "$group": {
                "_id": {
                  "brand": "$brand"
                }
              }
            },
            {
              "$sort": {
                "_id.brand.name": 1
              }
            }
          ], (err3, result3) => {
            if (err3) {
              console.error(err3);
              res.status(500).send({
                message: 'ocurrio un error al consultar los filtros (marca)'
              });
            } else if (!result3) {
              res.status(404).send({
                message: 'no se obtuvieron resultados con los filtros especificados'
              });
            } else {
              //Obtuvo resultados para marca
              resultados['brands'] = [];
              for (var i = 0; i < result3.length; i++) {
                resultados['brands'].push({
                  code: result3[i]._id.brand.code,
                  name: result3[i]._id.brand.name
                });
              }
              Item.aggregate([{
                  "$match": filterObject
                },
                {
                  "$group": {
                    "_id": {
                      "color": "$color.genericcolor"
                    }
                  }
                },
                {
                  "$sort": {
                    "_id.color.name": 1
                  }
                }
              ], (err4, result4) => {
                if (err4) {
                  console.error(err4);
                  res.status(500).send({
                    message: 'ocurrio un error al consultar los filtros (color)'
                  });
                } else if (!result4) {
                  res.status(404).send({
                    message: 'no se obtuvieron resultados con los filtros especificados'
                  });
                } else {
                  //Obtuvo resultados para color
                  resultados['colors'] = [];
                  for (var i = 0; i < result4.length; i++) {
                    if (result4[i]._id.color != null) {
                      resultados['colors'].push({
                        code: result4[i]._id.color.code,
                        name: result4[i]._id.color.name
                      });
                    }
                  }
                  Item.aggregate([{
                      "$match": filterObject
                    },
                    {
                      "$unwind": "$materials"
                    },
                    {
                      "$group": {
                        "_id": {
                          "material": "$materials"
                        }
                      }
                    },
                    {
                      "$sort": {
                        "_id.material.name": 1
                      }
                    }
                  ], (err5, result5) => {
                    if (err5) {
                      console.error(err5);
                      res.status(500).send({
                        message: 'ocurrio un error al consultar los filtros (material)'
                      });
                    } else if (!result5) {
                      res.status(404).send({
                        message: 'no se obtuvieron resultados con los filtros especificados'
                      });
                    } else {
                      //Obtuvo resultados para material
                      resultados['materials'] = [];
                      for (var i = 0; i < result5.length; i++) {
                        if (result5[i]._id.material != null && result5[i]._id.material.name != null) {
                          resultados['materials'].push({
                            code: result5[i]._id.material.code,
                            name: result5[i]._id.material.name
                          });
                        }
                      }
                      Item.aggregate([{
                          "$match": filterObject
                        },
                        {
                          "$group": {
                            "_id": null,
                            minPrice: {
                              $min: "$priceaftervat"
                            },
                            maxPrice: {
                              $max: "$priceaftervat"
                            }
                          }
                        }
                      ], (err6, result6) => {
                        if (err6) {
                          console.error(err6);
                          res.status(500).send({
                            message: 'ocurrio un error al consultar los filtros (material)'
                          });
                        } else if (!result6) {
                          res.status(404).send({
                            message: 'no se obtuvieron resultados con los filtros especificados'
                          });
                        } else {
                          //Obtuvo resultados para precioMinimo
                          resultados['prices'] = result6[0];

                          Item.aggregate([{
                              "$match": filterObject
                            },
                            {
                              "$group": {
                                "_id": {
                                  "collection": "$collection"
                                }
                              }
                            },
                            {
                              "$sort": {
                                "_id.collection": 1
                              }
                            }
                          ], (err7, result7) => {
                            if (err7) {
                              console.error(err7);
                              res.status(500).send({
                                message: 'ocurrio un error al consultar los filtros (coleccion)'
                              });
                            } else if (!result7) {
                              res.status(404).send({
                                message: 'no se obtuvieron resultados con los filtros especificados'
                              });
                            } else {
                              resultados['collection'] = [];
                              for (var i = 0; i < result7.length; i++) {
                                if (result7[i]._id.collection != null && result7[i]._id.collection != 0) {
                                  resultados['collection'].push(result7[i]._id.collection);
                                }
                              }

                              Item.aggregate([{
                                "$match": filterObject
                              }], (err8, result8) => {
                                if (err8) {
                                  console.error(err8);
                                  res.status(500).send({
                                    message: 'ocurrio un error al consultar los filtros (descuento)'
                                  });
                                } else if (!result8) {
                                  res.status(404).send({
                                    message: 'no se obtuvieron resultados con los filtros especificados'
                                  });
                                } else {
                                  //Obtuvo resultados para coleccion
                                  res.status(200).send({
                                    result: resultados
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

function consultarGrupo(req, res) {
  Item.find({
    "group.code": req.query.fieldValue
  }, {
    "group": 1
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al ejecutar la consulta'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvo ningún resultado con los filtros especificados'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).limit(1);
}

function consultarSubgrupo(req, res) {
  var queryObject = {};
  if (req.query.fieldValue.indexOf(',') >= 0) {
    queryObject = {
      "subgroup.code": {
        $in: req.query.fieldValue.split(',')
      }
    };
  } else {
    queryObject = {
      "subgroup.code": req.query.fieldValue
    };
  }
  Item.distinct("subgroup", queryObject, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al ejecutar la consulta'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvo ningún resultado con los filtros especificados'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  });
}

function consultarMarca(req, res) {
  Brand.find({
    "code": req.query.fieldValue
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al ejecutar la consulta'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvo ningún resultado con los filtros especificados'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).limit(1);
}

function consultarColor(req, res) {
  Color.find({
    "code": req.query.fieldValue
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al ejecutar la consulta'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvo ningún resultado con los filtros especificados'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).limit(1);
}

function consultarMaterial(req, res) {
  Material.find({
    "code": req.query.fieldValue
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al ejecutar la consulta'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvo ningún resultado con los filtros especificados'
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  }).limit(1);
}

function obtenerRelacionados(req, res) {
  var modelo = req.params.model;

  Item.find({
    "model": modelo,
    "images": {
      $exists: true,
      $not: {
        $size: 0
      }
    },
    "availablestock": {
      $gt: 0
    }
  }, {
    "color": 1,
    "shortitemcode": 1
  }, (err, items) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar los productos'
      });
    } else if (!items) {
      res.status(404).send({
        message: 'no se encontró ningún producto con los filtros especificados'
      });
    } else {
      res.status(200).send({
        items: items
      });
    }
  });
}

function listarMarcasVajillas(req, res) {
  Item.aggregate([{
      $match: {
        // "group.code": "024",
        "group.code": {$in: [ "024", "012","002", "003", "005", "006", "009", "013", "014" ]},
        "availablestock": {
          $gt: 0
        }
      }
    },
    {
      $project: {
        "brand": 1
      }
    },
    {
      $group: {
        _id: "$brand._id"
      }
    },
    {
      $lookup: {
        from: "brands",
        localField: "_id",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $unwind: "$brand"
    },
    {
      $project: {
        "_id": 0
      }
    },
    {
      $sort: {
        "brand.name": 1
      }
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar las marcas de productos'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontraron marcas de productos'
      });
    } else {
      res.status(200).send(result);
    }
  });
}

function listarColeccionesPorMarca(req, res) {
  Item.distinct(
    "collection", {
      "brand.code": req.params.brand,
      "collection": {
        $ne: null
      }
    }, (err, result) => {
      if (err) {
        res.status(500).send({
          message: 'ocurrio un error al ejecutar la consulta'
        });
      } else if (!result) {
        res.status(404).send({
          message: 'no se encontraron marcas en la base de datos'
        });
      } else {
        res.status(200).send(result);
      }
    });
}

module.exports = {
  consultarItem,
  consultarNuevos,
  filtrar,
  consultarFiltros,
  consultarGrupo,
  consultarSubgrupo,
  consultarMarca,
  consultarColor,
  consultarMaterial,
  obtenerRelacionados,
  listarMarcasVajillas,
  listarColeccionesPorMarca
};
