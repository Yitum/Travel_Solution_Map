import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'updateOrigin',
      'updateDestination',
      'updateFavorite',
      'updateOriginDisplay',
      'updateDestinationDisplay',
      'invalidOrigin',
      'invalidDestination',
      'invalidFavorite',
      'invalidDirectionRequest',
      'getPlacesInfoSuccess',
      'getPlacesInfoFail'
    );

  }

  getPlacesInfo(callback) {
    $.ajax({
      type: 'GET',
      url: '/api/places/info'
    })
      .done((data) => {
        this.actions.getPlacesInfoSuccess(data);
        callback();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.getPlacesInfoFail(jqXHR);
      });
  }
}

export default alt.createActions(HomeActions);