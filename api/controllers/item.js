'use strict'

//Librerias para manejo de archivos (FileSystem)
//var fs = require('fs');
//var path = require('path');

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
      console.log(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar el producto'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se encontró ningún producto con el itemcode ' + req.query.itemcode
      });
    } else {
      res.status(200).send({
        result: result
      });
    }
  });
}

function consultarNuevos(req, res) {
  Item.find({}, (err, result) => {
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
  var department = req.query.department;
  var group = req.query.group;
  var subgroup = req.query.subgroup;
  var brand = req.query.brand;
  var color = req.query.color;
  var material = req.query.material;

  var filterObject = {};
  if (typeof department != 'undefined' && department != null) {
    filterObject['department.code'] = department;
  }
  if (typeof group != 'undefined' && group != null) {
    filterObject['group.code'] = group;
  }
  if (typeof subgroup != 'undefined' && subgroup != null) {
    filterObject['subgroup.code'] = subgroup;
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
    orderBy = 'model';
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
      Item.find(filterObject, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'ocurrio un error al consultar los productos'
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
          "department": "$department"
        }
      }
    },
    {
      "$sort": {
        "_id.department.name": 1
      }
    }
  ], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'ocurrio un error al consultar los filtros (dpto)'
      });
    } else if (!result) {
      res.status(404).send({
        message: 'no se obtuvieron resultados con los filtros especificados'
      });
    } else {
      //Obtuvo resultados para departamento, continua con grupo
      resultados['departments'] = [];
      for (var i = 0; i < result.length; i++) {
        resultados['departments'].push({
          code: result[i]._id.department.code,
          name: result[i]._id.department.name
        });
      }
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
                          //Obtuvo resultados para color
                          resultados['materials'] = [];
                          for (var i = 0; i < result5.length; i++) {
                            if (result5[i]._id.material != null && result5[i]._id.material.name != null) {
                              resultados['materials'].push({
                                code: result5[i]._id.material.code,
                                name: result5[i]._id.material.name
                              });
                            }
                          }
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
  Item.find({
    "subgroup.code": req.query.fieldValue
  }, {
    "subgroup": 1
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
    "model": modelo
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
  obtenerRelacionados
};
