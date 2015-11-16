import alt from '../alt';
import PlaceInfoActions from '../actions/PlaceInfoActions';

class PlaceInfoStore {
  constructor() {
    this.bindActions(PlaceInfoActions);
    this.name = 'TBD';
    this.description = 'TBD';
    this.coordinate = {'lat': '', 'lng': ''};
    this.image = '';
    this.rate = 5;
  }

  onGetPlaceInfoSuccess(data) {
    this.name = data.name;
    this.description = data.description;
    this.coordinate = data.coordinate;
    this.image = data.img;
    this.rate = data.review.overall;
  }

  onGetPlaceInfoFail(jqXHR) {
    toastr.error(jqXHR.responseJSON.message);
  }
}

export default alt.createStore(PlaceInfoStore);