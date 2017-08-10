'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
var options = {
  user: 'web',
  pass: 'Baru1234.'
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.5.78:27017/matisses?authSource=matisses', options, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('conexion a base de datos exitosa');
        app.listen(port, function(){
            console.log('API escuchando en puerto ' + port);
        });
    }
});
