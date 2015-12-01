import React from 'react';
import PlaceInfo from './PlaceInfo';
import PlaceReview from './PlaceReview';
import PlaceCommentList from './PlaceCommentList';

class Place extends React.Component {
  constructor(props) {
    super(props);
    this.placename = props.params.placename;
  }

  componentDidUpdate() {
    location.reload();
  }

  render() {
    return(
      <div className='container'>
        <PlaceInfo placename={this.placename} />
        <PlaceCommentList placename={this.placename} />
        <PlaceReview placename={this.placename} />
      </div>
    );
  }
}

export default Place;