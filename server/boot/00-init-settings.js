var engines = require('consolidate'); // templating engines
var bodyParser = require('body-parser');
var express = require('express');

module.exports = function (server) {
  // middleware
  server.use(express.static(__dirname + '/../../client/src'));
  server.use(bodyParser.json()); 
  server.use(bodyParser.urlencoded({ extended: true }));

  // view engine
  server.set('view engine', 'ejs');
  server.set('views', __dirname + '/../views');

  // enable authentication
  server.enableAuth();
};
