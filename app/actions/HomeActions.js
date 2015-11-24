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

  getPlacesInfo() {
    $.ajax({
      type: 'GET',
      url: '/api/places/info'
    })
      .done((data) => {
        this.actions.getPlacesInfoSuccess(data);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.getPlacesInfoFail(errorThrown);
      });
  }
}

export default alt.createActions(HomeActions);