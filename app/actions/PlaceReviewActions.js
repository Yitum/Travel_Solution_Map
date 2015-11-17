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
      'invalidText',
      'addReviewSuccess',
      'addReviewFail'
    );
  }

  addReview(placename, food, entertainment, traffic, beauty, author, text) {
    $.ajax({
      type: 'POST',
      url: '/api/places/comments',
      data: {placename, food, entertainment, traffic, beauty, author, text}
    })
      .done((data) => {
        this.actions.addReviewSuccess(data.message);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.addReviewFail(jqXHR.responseJSON.message);
      });
  }
}

export default alt.createActions(PlaceReviewActions);