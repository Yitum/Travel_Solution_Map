import React from 'react';
import PlaceInfoActions from '../actions/PlaceInfoActions';
import PlaceInfoStore from '../stores/PlaceInfoStore';

class PlaceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = PlaceInfoStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PlaceInfoStore.listen(this.onChange);
    PlaceInfoActions.getPlaceInfo(this.props.name);

    $('.magnific-popup').magnificPopup({
      type:'image',
      mainClass: 'mfp-zoom-in',
      closeOnContentClick: true,
      midClick: true
    });
  }

  componentWillMount() {
    PlaceInfoStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return(
      <div className='container'>
        <div className='profile-img'>
          <a className='magnific-popup' href={this.state.image}>
            <img src={this.state.image} />
          </a>
        </div>
        <div className='profile-info clearfix'>
          <h2><strong>{this.state.name}</strong></h2>
          <h4 className='lead'>Description: <strong>{this.state.description}</strong></h4>
          <h4 className='lead'>Latitute: <strong>{this.state.coordinate.lat}</strong></h4>
          <h4 className='lead'>Longitude: <strong>{this.state.coordinate.lng}</strong></h4>
        </div>
        <div className='profile-stats clearfix'>
          <ul>
            <li><span className='stats-number'></span>Rate</li>
            <li><span className='stats-number'></span>Review</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default PlaceInfo;