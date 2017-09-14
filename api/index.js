'use strict'

var mongoose = require('mongoose');
var fs = require('fs');
var https = require('https');
var app = require('./app');
var port = process.env.PORT || 3977;

var options = {
  key: fs.readFileSync('ssl/matisses.co.key'),
  cert: fs.readFileSync('ssl/matisses.co.crt'),
  passphrase: 'Baru1234.'
}

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://api.matisses.co:27017/matisses', (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('conexion a base de datos exitosa');

    https.createServer(options, app).listen(3977, function() {
      console.log('Started SSL!');
    });
    // app.listen(port, function() {
    //  console.log('API escuchando en puerto ' + port);
    // });
  }
});
