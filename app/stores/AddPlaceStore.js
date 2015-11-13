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
    this.coordinateValidationState = '';
    this.imageValidationState = '';

    this.description = '';
    this.coordinate = {'lat': '', 'lng': ''};
    this.imageUrl = '';
  }

  onAddCharacterSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    this.helpBlock = successMessage;
  }

  onAddCharacterFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onAddPlaceSuccess(successMessage) {
    this.helpBlock = successMessage;
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

  onUpdateCoordinateLat(event) {
    this.coordinate.lat = event.target.value;
    this.coordinateValidationState = '';
    this.helpBlock = '';
  }

  onUpdateCoordinateLng(event) {
    this.coordinate.lng = event.target.value;
    this.coordinateValidationState = '';
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