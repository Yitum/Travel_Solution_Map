import React from 'react';
import PlaceInfo from './PlaceInfo';
import PlaceReview from './PlaceReview';

class Place extends React.Component {
  constructor(props) {
    super(props);
    this.placename = props.params.placename;
  }

  render() {
    return(
      <div className='container'>
        <PlaceInfo placename={this.placename} />
        <PlaceReview placename={this.placename} />
      </div>
    );
  }
}

export default Place;