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

module.exports = mongoose.model('Place', placeSchema);