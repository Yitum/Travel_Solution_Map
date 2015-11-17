import alt from '../alt';
import PlaceReviewActions from '../actions/PlaceReviewActions';

class PlaceReviewStore {
  constructor() {
    this.bindActions(PlaceReviewActions);
    this.helpBlock = '';

    this.foodValidationState = '';
    this.entertainmentValidationState = '';
    this.trafficValidationState = '';
    this.beautyValidationState = '';
    this.authorValidationState = '';
    this.textValidationState = '';

    this.overall = 0;
    this.food = 0;
    this.entertainment =0;
    this.traffic = 0;
    this.beauty = 0;
    this.comment = {
      'date': Date(),
      'author': '',
      'text': ''
    };
  }

  onInvalidFoodRate() {
    this.foodValidationState = 'has-error';
    this.helpBlock = 'Place rate food';
  }

  onInvalidEntertainmentRate() {
    this.entertainmentValidationState = 'has-error';
    this.helpBlock = 'Place rate entertainment';
  }

  onInvalidTrafficRate() {
    this.trafficValidationState = 'has-error';
    this.helpBlock = 'Place rate traffic';
  }

  onInvalidBeautyRate() {
    this.beautyValidationState = 'has-error';
    this.helpBlock = 'Place rate beauty';
  }

  onInvalidAuthor() {
    this.authorValidationState = 'has-error';
    this.helpBlock = 'Place input your name';
  }

  onInvalidText() {
    this.textValidationState = 'has-error';
    this.helpBlock = 'Place leave your comment';
  }

  onUpdateFoodRate(event) {
    this.food = event.target.value;
    this.foodValidationState = '';
    this.helpBlock = '';
  }

  onUpdateEntertainmentRate(event) {
    this.entertainment = event.target.value;
    this.entertainmentValidationState = '';
    this.helpBlock = '';
  }

  onUpdateTrafficRate(event) {
    this.traffic = event.target.value;
    this.trafficValidationState = '';
    this.helpBlock = '';
  }

  onUpdateBeautyRate(event) {
    this.beauty = event.target.value;
    this.beautyValidationState = '';
    this.helpBlock = '';
  }

  onUpdateAuthor(event) {
    this.comment.author = event.target.value;
    this.authorValidationState = '';
    this.helpBlock = '';
  }

  onUpdateText(event) {
    this.comment.text = event.target.value;
    this.textValidationState = '';
    this.helpBlock = '';
  }

}

export default alt.createStore(PlaceReviewStore);