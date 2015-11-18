import alt from '../alt';

class PlaceCommentListActions {
  constructor() {
    this.generateActions(
      'getCommentsSuccess',
      'getCommentsFail'
    );
  }

  getComments(name) {
    $.ajax({
      type: 'GET',
      url: '/api/places/comments',
      data: {name: name}
    })
      .done((data) => {
        this.actions.getCommentsSuccess(data);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        this.actions.getCommentsFail(errorThrown);
      });
  }

}

export default alt.createActions(PlaceCommentListActions);