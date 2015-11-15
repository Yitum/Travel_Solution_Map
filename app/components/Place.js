import React from 'react';
import PlaceInfo from './PlaceInfo';
import PlaceReview from './PlaceReview';

class Place extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.params.name;
  }

  render() {
    return(
      <div className='container'>
        <PlaceInfo name={this.name} />
        <PlaceReview name={this.name} />
      </div>
    );
  }
}

export default Place;