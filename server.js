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
var routeAlgorithm = require('./route_algorithm');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
/* A middleware to parse json*/
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.post('/api/places/review', function(req, res, next) {
  var placename = req.body.placename.toLowerCase();
  var food = parseInt(req.body.food);
  var entertainment = parseInt(req.body.entertainment);
  var traffic = parseInt(req.body.traffic);
  var beauty = parseInt(req.body.beauty);
  var overall = (food + entertainment + traffic + beauty) / 4;
  var author = req.body.author;
  var text = req.body.text;

  async.waterfall([
    function(callback) {
      Place.findOne({name: placename}, function(err, place) {
        if (err) return next(err);

        if (!place) {
          return res.status(409).send({message: 'Unable to find ' + placename});
        }
        callback(null, place);
      });
    },
    function(place, callback) {
      place.review.comments.push({
        food: food, entertainment: entertainment, traffic: traffic,
        beauty: beauty, overall: overall, author: author, date: Date(), text: text});
      place.updateRate();
      place.save(function(err) {
        if (err) return next(err);

        res.send({message: 'Your review has been submitted successfully'});
      })
    }
  ]);
});

app.post('/api/places', function(req, res, next) {
  var name = req.body.name.toLowerCase();
  var description = req.body.description;
  var coordinate = JSON.parse(req.body.coordinate);
  var imageUrl = req.body.imageUrl;

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

app.get('/api/places/favorite/:type', function(req, res, next) {
  var favorite = req.params.type;
  var origin = JSON.parse(req.query.origin);
  var destination = JSON.parse(req.query.destination);
  var stops = JSON.parse(req.query.stops);

  var myRoute = new routeAlgorithm();
  var routeResult;

  var sendResult = function(err, result) {
    console.log('*********' + JSON.stringify(result));

    if (!result.waypoint) return res.send('');


    var selectResult = JSON.stringify(result.waypoint);
    res.send(selectResult);
  }

  if(favorite == 'distance') return sendResult('');

  myRoute.getRoute(origin, destination, stops, favorite, sendResult.bind(this));

});

app.get('/api/places/info', function(req, res, next) {
  Place.find(null, 'name description coordinate review.overall review.food review.entertainment review.traffic review.beauty',
    function(err, places) {
    if (err) return next(err);

    if (!places) {
      return res.status(409).send({message: 'Fail to get place basic infomation'})
    }
    res.send(places);
  })
});

app.get('/api/places/search', function(req, res, next) {
  var name = req.query.name.toLowerCase();

  Place.findOne({name: name}, {name}, function(err, place) {
    if (err) return next(err);

    if(!place) {
      return res.status(404).send({message: 'No place matched in database'});
    }

    res.send(place);
  });
});

app.get('/api/places/count', function(req, res, next) {
  Place.count({}, function(err, count) {
    if(err) return next(err);

    res.send({count: count});
  })
});

app.get('/api/places/comments', function(req, res, next) {
  var name = req.query.name.toLowerCase();

  Place.findOne({name: name}, function(err, place) {
    if (err) return next(err);

    if (!place) {
      return res.status(409).send({message: 'Fail to get comments from ' + name})
    }

    res.send(place.review.comments);
  });
});

app.get('/api/places/:name', function(req, res, next) {
  var name = req.params.name.toLowerCase();

  Place.findOne({ name: name }, function(err, place) {
    if (err) return next(err);

    if (!place) {
      return res.status(404).send({message: 'Place Not Found.'});
    }

    res.send(place);
  });
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