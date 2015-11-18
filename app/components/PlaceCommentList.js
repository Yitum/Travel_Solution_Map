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

  onChange(state) {
    this.setState(state);
  }

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h2 className="page-header">Comments</h2>
              <section className="comment-list">

                <article className="row">
                  <div className="col-md-2 col-sm-2 hidden-xs">
                    <figure className="thumbnail">
                      <img className="img-responsive" src='/img/default-avatar.jpg' />
                      <figcaption className="text-center">username</figcaption>
                    </figure>
                  </div>
                  <div className="col-md-10 col-sm-10">
                    <div className="panel panel-default arrow left">
                      <div className="panel-body">
                        <header className="text-left">
                          <div className="comment-user"><i className="fa fa-user"></i> That Guy</div>
                          <time className="comment-date" datetime="16-12-2014 01:05"><i className="fa fa-clock-o"></i> Dec 16, 2014</time>
                        </header>
                        <div className="comment-post">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                          </p>
                        </div>
                        <p className="text-right"><a href="#" className="btn btn-default btn-sm"><i className="fa fa-reply"></i> reply</a></p>
                      </div>
                    </div>
                  </div>
                </article>

              </section>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaceCommentList;