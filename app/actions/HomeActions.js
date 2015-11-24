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
      'invalidDirectionRequest'
    );

  }
}

export default alt.createActions(HomeActions);