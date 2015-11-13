var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var RoutingContext = Router.RoutingContext;
var routes = require('./app/routes');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var mongoose = require('mongoose');
var Character = require('./models/character');
var Place = require('./models/place');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;
var config = require('./config');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
/* A middleware to parse json*/
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.post('/api/places', function(req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  var coordinate = JSON.parse(req.body.coordinate);
  var imageUrl = req.body.imageUrl;

  /*Place.findOne({name: name}, function(err, place) {
      if (err) return next(err);

      if (place) {
        return res.status(409).send({message: place.name + ' is already in the database'});
      }
  });

  console.log('coordinate is ' + coordinate);
  console.log('img is ' + imageUrl);
  var place = new Place({
    name: name,
    description: description,
    coordinate: coordinate,
    img: imageUrl
  });

  place.save(function(err) {
    if (err) return next(err);

    res.send({message: name + ' has been add successfully!'});
  });*/
  async.series([
    function(callback) {
      Place.findOne({name: name}, function(err, place) {
        if (err) return next(err);

        if (place) {
          return res.status(409).send({message: place.name + ' is already in the database'});
        }

        callback(null);
      });
    },
    function(callback) {
      console.log('Able to add new place');

      var place = new Place({
        name: name,
        description: description,
        coordinate: coordinate,
        img: imageUrl
      });
    
      place.save(function(err) {
        if (err) return next(err);

        res.send({message: name + ' has been add successfully!'});
      });

    }]
  );
});

app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

/**
 * Socket.io stuff.
 */

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});