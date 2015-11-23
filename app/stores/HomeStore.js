import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.helpBlock = '';
    this.origin = '';
    this.destination = '';
    this.favorite = 'Favorite';
    this.originValidationState = '';
    this.destinationValidationState = '';
    this.favoriteValidationState = 'btn-default';
  }

  onUpdateOrigin(event) {
    this.origin = event.target.value;
    this.originValidationState = '';
    this.helpBlock = '';
  }

  onUpdateDestination(event) {
    this.destination = event.target.value;
    this.destinationValidationState = '';
    this.helpBlock = '';
  }

  onUpdateFavorite(event) {
    this.favorite = event[0];
    this.favoriteValidationState = 'btn-default';
    this.helpBlock = '';
  }

  onInvalidOrigin() {
    this.originValidationState = 'has-error';
    this.helpBlock = 'Please input your start place';
  }

  onInvalidDestination() {
    this.destinationValidationState = 'has-error';
    this.helpBlock = 'Please input your end place';
  }

  onInvalidFavorite() {
    this.favoriteValidationState = 'btn-warning';
    this.helpBlock = 'Please select your favorite';
  }

}

export default alt.createStore(HomeStore);