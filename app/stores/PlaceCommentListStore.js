import alt from '../alt';
import PlaceCommentListActions from '../actions/PlaceCommentListActions';

class PlaceCommentListStore {
  constructor() {
    this.bindActions(PlaceCommentListActions);
    this.comments = [];
  }

  onGetCommentsSuccess(data) {
    this.comments = data;
    console.log(this.comments);
  }

  onGetCommentsFail(failMessage) {
    toastr.error(failMessage);
  }
}

export default alt.createStore(PlaceCommentListStore);