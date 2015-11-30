var async = require('async');

var Place = require('./models/place');

var greedy = function() {

  this.getWaypoint = function(origin, destination, favorite, callbackFunc){
    var largeLat = origin.location.lat > destination.location.lat ? origin.location.lat : destination.location.lat;
    var smallLat = origin.location.lat < destination.location.lat ? origin.location.lat : destination.location.lat;
    var largeLng = origin.location.lng > destination.location.lng ? origin.location.lng : destination.location.lng;
    var smallLng = origin.location.lng < destination.location.lng ? origin.location.lng : destination.location.lng;
  
    async.waterfall([
      /* Get all of place in the database */
      function(callback) {
        Place.
          find().
          select('name coordinate review.overall review.food review.entertainment review.traffic review.beauty').
          exec(function(err, places) {
            if (err) return next(err);

            if (!places) {
              return res.status(409).send({message: ''});
            }

            return callback(null, places);
          });
      },
      /* Filter those places where located between origin and destination */
      function(places, callback) {
        var nodes = [];

        places.forEach(function(place, index) {
          var lat = place.coordinate.lat;
          var lng = place.coordinate.lng;

          if (lat > smallLat && lat < largeLat) {
            if (lng > smallLng && lng < largeLng) {
              nodes.push(place);
            }
          }
        });

        if (nodes.length == 0) {
          callback(new Error('No place between origin and destination'));
        }

        return callback(null, nodes);
      },
      /* Return the most rated place depending on favorite trype */
      function(places, callback){
        var maxRated = {
          review: {
            food: 0,
            entertainment: 0,
            traffic: 0,
            beauty: 0
          }
        };

        places.forEach(function(place) {
          if (favorite == 'food') {
            if (place.review.food >= maxRated.review.food) {
              maxRated = place;
            }
          } else if (favorite == 'entertainment') {
            if (place.review.entertainment >= maxRated.review.entertainment) {
              maxRated = place;
            }
          } else if (favorite == 'traffic') {
            if (place.review.traffic >= maxRated.review.traffic) {
              maxRated = place;
            }
          } else if (favorite == 'beauty') {
            if (place.review.beauty >= maxRated.review.beauty) {
              maxRated = place;
            }
          }
        });

        return callback(null, maxRated);
      }
    ], function(err, result) {
      var resultArray;

      if (err) {
        console.log(err);
        resultArray = '';
      } else {
        /* push the object to an array for later process */
        resultArray = [result];
      }

      var wrappedResult = {origin: origin, destination: destination, waypoint: resultArray};
      return callbackFunc(null, wrappedResult);
    });

  }
}

var route_algorithm = function() {
  var wayPoints = [];

  var pushWaypoint = function (waypoint) {
    if (!wayPoints) {
      wayPoints.push(waypoint);
      console.log('%s has been pushed to wayPoints array', waypoint.name);
      return;
    }

    var pushState = true;
    wayPoints.forEach(function(myWaypoint) {
      if(myWaypoint.name == waypoint.name) pushState = false;
    })

    if (pushState) {
      wayPoints.push(waypoint);
      console.log('%s has been pushed to wayPoints array', waypoint.name);
    } else {
      console.log('%s has already exsisted in wayPoints array', waypoint.name);
    }
  }

  this.getRoute = function(origin, destination, stops, favorite, callbackFunc) {
    this.origin = origin;
    this.destination = destination;
    this.stops = stops;

    var myGreedy = new greedy();

    if (this.stops.length > 0) {

      var currentOrigin = origin;
      var stopArray = this.stops.slice();

      var foo = function(stopArray, currentOrigin) {
        console.log('******************************************************');
        console.log('stopArray: %s', JSON.stringify(stopArray));
        console.log('currentOrigin: %s', JSON.stringify(currentOrigin));

        async.waterfall([
          function(callback) {
            async.map(stopArray, function(stop, myCallback) {
              myGreedy.getWaypoint(currentOrigin, stop, favorite, myCallback.bind(this));
            }, function(err, results) {
              callback(null, results);
            });
          },
          function(resultArray, callback) {
            console.log('******************************************************');
            console.log('All of waypoint: ' + JSON.stringify(resultArray));

            var maxRated = {waypoint: [{review: {food: 0, entertainment: 0, traffic: 0, beauty: 0}}]};

            /* Fix me! How to handle error */
            if (!resultArray) callback(null);

            resultArray.forEach(function(result, index) {
              if (favorite == 'food') {
                maxRated = result.waypoint[0].review.food >= maxRated.waypoint[0].review.food ? result : maxRated;
              } else if (favorite == 'entertainment') {
                maxRated = result.waypoint[0].entertainment >= maxRated.waypoint[0].review.entertainment ? result : maxRated;
              } else if (favorite == 'traffic') {
                maxRated = result.waypoint[0].traffic >= maxRated.waypoint[0].review.traffic ? result : maxRated;
              } else if (favorite == 'beauty') {
                maxRated = result.waypoint[0].beauty >= maxRated.waypoint[0].review.beauty ? result : maxRated;
              }
            });
            console.log('******************************************************');
            console.log('Find out the most rated %s is %s', favorite, JSON.stringify(maxRated));

            pushWaypoint(maxRated.waypoint[0]);

            var index = stopArray.indexOf(maxRated.destination);
            currentOrigin = stopArray.splice(index, 1)[0];
            console.log('%s has been deleted from stop array', JSON.stringify(currentOrigin));
            console.log('******************************************************');

            callback(null, {stopArray: stopArray, currentOrigin: currentOrigin});
          },
          function (result, callback) {
            var stopArray = result.stopArray;
            var currentOrigin = result.currentOrigin;

            console.log('New stop array is ' + JSON.stringify(stopArray));
            console.log('Current origin is ' + JSON.stringify(result.currentOrigin));
            console.log('-----------------------------------------------------------');
            if (stopArray.length > 0) {
              new foo(stopArray, result.currentOrigin);
            } else {
              console.log('Start the last search from %s to %s', currentOrigin.name, destination.name);
              myGreedy.getWaypoint(currentOrigin, destination, favorite, callback.bind(this));
            }
          },
          function (result, callback) {
            if (result.waypoint) pushWaypoint(result.waypoint[0]);
            var newStop = stops.map(function(stop) {
              return {
                name: stop.name,
                coordinate: stop.location
              }
            })
            var wrappedResult = {origin: origin, destination: destination, waypoint: wayPoints.concat(newStop)}
            console.log('The final waypoints is ' + JSON.stringify(wrappedResult));
            callbackFunc(null, wrappedResult);
          }
        ]);
      }

      new foo(stopArray, currentOrigin, callbackFunc);

    } else {
      myGreedy.getWaypoint(origin, destination, favorite, callbackFunc);
    }
  }

}

module.exports = route_algorithm;