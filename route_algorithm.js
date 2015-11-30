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

            callback(null, places);
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
          return res.status(409).send({message: 'No place found between two cities'});
        }

        callback(null, nodes);
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
            if (place.review.food > maxRated.review.food) {
              maxRated = place;
            }
          } else if (favorite == 'entertainment') {
            if (place.review.entertainment > maxRated.review.entertainment) {
              maxRated = place;
            }
          } else if (favorite == 'traffic') {
            if (place.review.traffic > maxRated.review.traffic) {
              maxRated = place;
            }
          } else if (favorite == 'beauty') {
            if (place.review.beauty > maxRated.review.beauty) {
              maxRated = place;
            }
          }
        });

        callback(null, maxRated);
      }
    ], function(err, result) {
      /* push the object to an array for later process */
      let resultArray = [result];

      callbackFunc(resultArray);
    });

  }
}

var route_algorithm = function() {

  this.getRoute = function(origin, destination, stops, favorite, callbackFunc) {
    this.origin = origin;
    this.destination = destination;
    this.stops = stops;

    var myGreedy = new greedy();
    var routes = [];

    if (this.stops.length > 0) {

    } else {
      myGreedy.getWaypoint(origin, destination, favorite, callbackFunc);
    }
  }

}

module.exports = route_algorithm;