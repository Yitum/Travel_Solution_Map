import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'updateOrigin',
      'updateDestination',
      'updateFavorite',
      'invalidOrigin',
      'invalidDestination',
      'invalidFavorite'
    );

  }
}

export default alt.createActions(HomeActions);