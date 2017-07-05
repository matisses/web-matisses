'use strict'

//Librerias para manejo de archivos (FileSystem) 
//var fs = require('fs');
//var path = require('path');

//Librerias para acceso a MongoDB
//var mongoosePaginate = require('mongoose-pagination');

//Modelo
var Item = require('../models/item');

function consultar(req, res) {
    console.log('consultando item(s) ' + req.params.referencia);
    
    
    res.status(200).send({
        message: 'prueba exitosa'
    });
}

module.exports = {
    consultar
};
