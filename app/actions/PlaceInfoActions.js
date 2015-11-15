import alt from '../alt';

class PlaceInfoActions {
  constructor() {
    this.generateActions(
      'getPlaceInfoSuccess',
      'getPlaceInfoFail'
    );
  }

  getPlaceInfo(placeName) {
    console.log('getPlaceInfo has been called')
    $.ajax({ url: '/api/places/' + placeName })
      .done((data) => {
        this.actions.getPlaceInfoSuccess(data);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.getPlaceInfoFail(jqXHR);
      });
  }
}

export default alt.createActions(PlaceInfoActions);