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
      'getPlacesInfoFail',
      'getWayPointsSuccess',
      'getWayPointsFail'
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

  getWayPoints(origin, destination, favorite, callback) {
    $.ajax({
      type: 'GET',
      url: '/api/places/favorite/' + favorite.toLowerCase(),
      data: {
        origin: JSON.stringify(origin),
        destination: JSON.stringify(destination)
      }
    })
      .done((data) => {
        this.actions.getWayPointsSuccess(data);
        callback();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.getWayPointsFail(jqXHR);
      });
  }
}

export default alt.createActions(HomeActions);