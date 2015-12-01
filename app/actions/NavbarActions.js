import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getCharacterCountSuccess',
      'getCharacterCountFail',
      'findCharacterSuccess',
      'findCharacterFail',
      'findPlaceSuccess',
      'findPlaceFail',
      'getPlaceCountSuccess',
      'getPlaceCountFail'
    );
  }

  findCharacter(payload) {
    $.ajax({
      url: '/api/characters/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findCharacterSuccess(payload);
      })
      .fail(() => {
        this.actions.findCharacterFail(payload);
      });
  }

  findPlace(payload) {
    $.ajax({
      url: '/api/places/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findPlaceSuccess(payload);
      })
      .fail(() => {
        this.actions.findPlaceFail(payload)
      })
  }

  getCharacterCount() {
    $.ajax({ url: '/api/characters/count' })
      .done((data) => {
        this.actions.getCharacterCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getCharacterCountFail(jqXhr)
      });
  }

  getPlaceCount() {
    $.ajax({ url: '/api/places/count' })
      .done((data) => {
        this.actions.getPlaceCountSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getPlaceCountFail(jqXhr);
      });
  }
}

export default alt.createActions(NavbarActions);