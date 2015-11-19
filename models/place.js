var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinate: {lat: Number, lng: Number},
  img: String,
  review: {
    overall: {type: Number, default: 0},
    food: {type: Number, default: 0},
    entertainment: {type: Number, default: 0},
    traffic: {type: Number, default: 0},
    beauty: {type: Number, default: 0},
    comments: [{
      author: String,
      date: Date,
      text: String,
      overall: {type: Number, default: 0},
      food: {type: Number, default: 0},
      entertainment: {type: Number, default: 0},
      traffic: {type: Number, default: 0},
      beauty: {type: Number, default: 0}
    }]
  }
});

placeSchema.method('updateRate', function() {
  var comments = this.review.comments;
  var overall = 0,
      food = 0,
      traffic = 0,
      entertainment = 0,
      beauty = 0,
      count = comments.length;

  comments.map((comment, index) => {
    overall += comment.overall;
    food += comment.food;
    entertainment += comment.entertainment;
    traffic += comment.traffic;
    beauty += comment.beauty;
  });

  this.review.overall = overall / count;
  this.review.food = overall / count;
  this.review.entertainment = entertainment / count;
  this.review.traffic = traffic / count;
  this.review.beauty = beauty / count;
});

module.exports = mongoose.model('Place', placeSchema);