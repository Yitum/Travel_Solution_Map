import alt from '../alt';

class PlaceReviewActions {
  constructor() {
    this.generateActions(
      'updateFoodRate',
      'updateEntertainmentRate',
      'updateTrafficRate',
      'updateBeautyRate',
      'updateAuthor',
      'updateText',
      'invalidFoodRate',
      'invalidEntertainmentRate',
      'invalidTrafficRate',
      'invalidBeautyRate',
      'invalidAuthor',
      'invalidText'
    );
  }

  addReview(placename, food, entertainment, traffic, beauty, author, text) {
    console.log(placename);
  }
}

export default alt.createActions(PlaceReviewActions);