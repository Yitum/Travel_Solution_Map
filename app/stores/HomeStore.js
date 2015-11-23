import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.orgin = '';
    this.destination = '';
    this.favorite = 'Favorite';
  }

  onUpdateOrigin(event) {
    console.log(event.target.value);
  }

  onUPdateDestination(event) {

  }

  onUpdateFavorite(event) {
    this.favorite = event[0];
  }


}

export default alt.createStore(HomeStore);