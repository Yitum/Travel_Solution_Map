import alt from '../alt';
import AddPlaceActions from '../actions/AddPlaceActions';

class AddPlaceStore {
  constructor() {
    this.bindActions(AddPlaceActions);
    this.name = '';
    this.gender = '';
    this.helpBlock = '';
    this.nameValidationState = '';
    this.genderValidationState = '';
    this.descriptionValidationState = '';
    this.imageValidationState = '';

    this.description = '';
    this.coordinate = {'lat': '', 'lng': ''};
    this.imageUrl = '';

    this.markers = [];
  }

  onAddPlaceSuccess(payload) {
    this.helpBlock = payload.message;
    payload.history.pushState(null, '/places/'+payload.name);
  }

  onAddPlaceFail(errorMessage) {
    this.helpBlock = errorMessage;
  }

  onUpdateName(event) {
    this.name = event.target.value;
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateGender(event) {
    this.gender = event.target.value;
    this.genderValidationState = '';
  }

  onUpdateDescription(event) {
    this.description = event.target.value;
    this.descriptionValidationState = '';
    this.helpBlock = '';
  }

  onUpdatePlaceInfo(place) {
    this.name = place.address_components[0].short_name;
    this.coordinate.lat = place.geometry.location.lat();
    this.coordinate.lng = place.geometry.location.lng();
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateImage(event) {
    this.imageUrl = event.target.files[0];
    this.imageValidationState = '';
    this.helpBlock = '';
  }

  onInvalidName() {
    this.nameValidationState = 'has-error';
    this.helpBlock = 'Please enter a city name';
  }

  onInvalidGender() {
    this.genderValidationState = 'has-error';
  }

  onInvalidDescription() {
    this.descriptionValidationState = 'has-error';
    this.helpBlock = 'Please enter a description';
  }

  onInvalidCoordinate() {
    this.coordinateValidationState = 'has-error';
    this.helpBlock = 'Please enter a coordinate';
  }

  onInvalidImage() {
    this.imageValidationState = 'has-error';
    this.helpBlock = 'Please select a image';
  }
}

export default alt.createStore(AddPlaceStore);