import React from 'react';
import PlaceCommentListActions from '../actions/PlaceCommentListActions';
import PlaceCommentListStore from '../stores/PlaceCommentListStore';

class PlaceCommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = PlaceCommentListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PlaceCommentListStore.listen(this.onChange);
    PlaceCommentListActions.getComments(this.props.placename);
  }

  componentWillMount() {
    PlaceCommentListStore.unlisten(this.onChange);
  }

  componentDidUpdate() {
    $('.rating').rating({
      size: 'xs',
      showClear: false,
      showCaption: false,
    });
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let commentsList = this.state.comments.map((comment, index) => {
      return(
        <div key={comment._id}>
          <article className="row">
            <div className="col-sm-2 hidden-xs">
              <figure className="thumbnail">
                <img className="img-responsive" src='/img/default-avatar.jpg' />
                <figcaption className="text-center">{comment.author}</figcaption>
              </figure>
            </div>
            <div className="col-sm-10">
              <div className="panel panel-default arrow left">
                <div className="panel-body">
                  <header className="text-left">
                    <div>
                      <input className='rating' type='number' value={comment.overall} readOnly='true'></input>
                    </div>
                    <div className="comment-user"><i className="fa fa-user"></i>{comment.author}</div>
                    <time className="comment-date"><i className="fa fa-clock-o"></i> {comment.date}</time>
                  </header>
                  <div className="comment-post">
                    <p>
                      { comment.text }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      );
    });

    return(
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h2 className="page-header">Comments</h2>
              <section className="comment-list">
                  {commentsList}
              </section>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaceCommentList;