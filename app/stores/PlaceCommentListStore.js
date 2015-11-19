import alt from '../alt';
import PlaceCommentListActions from '../actions/PlaceCommentListActions';

class PlaceCommentListStore {
  constructor() {
    this.bindActions(PlaceCommentListActions);
    this.comments = [];
  }

  onGetCommentsSuccess(data) {
    this.comments = data;
  }

  onGetCommentsFail(failMessage) {
    toastr.error(failMessage);
  }
}

export default alt.createStore(PlaceCommentListStore);