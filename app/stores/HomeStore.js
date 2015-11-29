import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.helpBlock = '';
    this.origin = {
      'name': '',
      'location': {'lat': '', 'lng': ''}
    };
    this.destination = {
      'name': '',
      'location': {'lat': '', 'lng': ''}
    };
    this.favorite = 'Favorite';
    this.originValidationState = '';
    this.destinationValidationState = '';
    this.favoriteValidationState = 'btn-default';

    this.markers = [];
    this.infoWindows = [];
    this.placesInfo =[];
    this.wayPoints = [];
    this.rawWayPoints = [{name: ''}];
    this.stops = [];
  }

  onDeleteStop(stopId) {
    this.stops[stopId] = {name:'', location: {lat:0, lng:0}};
  }

  onUpdateStopsDisplay(event) {
    this.stops[event.target.id].name = event.target.value;
  }

  onUpdateStops(place) {
    this.stops[place.inputId].name = place.address_components[0].short_name;
    this.stops[place.inputId].location.lat = place.geometry.location.lat();
    this.stops[place.inputId].location.lng = place.geometry.location.lng();
  }

  onUpdateOrigin(place) {
    this.origin.name = place.address_components[0].short_name;
    this.origin.location.lat = place.geometry.location.lat();
    this.origin.location.lng = place.geometry.location.lng();
    this.originValidationState = '';
    this.helpBlock = '';
  }

  onUpdateDestination(place) {
    this.destination.name = place.address_components[0].short_name;
    this.destination.location.lat = place.geometry.location.lat();
    this.destination.location.lng = place.geometry.location.lng();
    this.destinationValidationState = '';
    this.helpBlock = '';
  }

  onUpdateFavorite(event) {
    this.favorite = event[0];
    this.favoriteValidationState = 'btn-default';
    this.helpBlock = '';
  }

  onUpdateOriginDisplay(event) {
    this.origin.name = event.target.value;
    this.originValidationState = '';
    this.helpBlock = '';
  }

  onUpdateDestinationDisplay(event) {
    this.destination.name = event.target.value;
    this.destinationValidationState = '';
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

  onInvalidDirectionRequest(status) {
    this.helpBlock = 'Directions request failed due to ' + status;
  }

  onGetPlacesInfoSuccess(places) {
    this.placesInfo = places;
    toastr.info('Get places basic info successfully')
  }

  onGetPlacesInfoFail(jqXHR) {
    toastr.error(jqXHR.responseJSON.message);
  }

  onGetWayPointsSuccess(data) {
    this.rawWayPoints = JSON.parse(data);
    var wayPoints = JSON.parse(data).map(function(waypoint) {
      return {
        location: waypoint.coordinate,
        stopover: true
      }
    });
    this.wayPoints = wayPoints;
  }

  onGetWayPointsFail(jqXHR) {

  }
}

export default alt.createStore(HomeStore);