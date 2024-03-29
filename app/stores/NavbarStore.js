import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.totalCharacters = 0;
    this.totalPlaces = 0;
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
  }

  onFindPlaceSuccess(payload) {
    payload.history.pushState(null, '/places/' + payload.name);
  }

  onFindPlaceFail(payload) {
    toastr.warning('No place matched in database');
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }

  onFindCharacterSuccess(payload) {
    payload.history.pushState(null, '/characters/' + payload.characterId);
  }

  onFindCharacterFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }

  onUpdateOnlineUsers(data) {
    this.onlineUsers = data.onlineUsers;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetCharacterCountSuccess(data) {
    this.totalCharacters = data.count;
  }

  onGetCharacterCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onGetPlaceCountSuccess(data) {
    this.totalPlaces = data.count;
  }

  onGetPlaceCountFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(NavbarStore);