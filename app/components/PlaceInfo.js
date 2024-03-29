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
    PlaceInfoActions.getPlaceInfo(this.props.placename);

    $('.magnific-popup').magnificPopup({
      type:'image',
      mainClass: 'mfp-zoom-in',
      closeOnContentClick: true,
      midClick: true
    });

    $('#rateInput').rating({
      size: 'sm',
      readOnly: true,
      showCaption: false,
      showClear: false
    });
  }

  componentWillMount() {
    PlaceInfoStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
    $('#rateInput').rating('update', this.state.rate);
  }

  render() {
    return(
      <div className='container'>
        <div className='col-sm-10'>
          <div className='profile-img'>
            <a className='magnific-popup' href={this.state.image}>
              <img src={this.state.image} />
            </a>
          </div>
          <div className='profile-info clearfix'>
            <h2 className='col-sm-10'><strong>{this.state.name.toUpperCase()}</strong></h2>
            <h4 className='lead col-sm-10'>Description: <i>{this.state.description}</i></h4>
            <h4 className='lead'>
              <span className='col-sm-5'>Latitute: <strong>{Number(this.state.coordinate.lat).toFixed(2)}</strong></span>
              <span className='col-sm-5'>Longitude: <strong>{Number(this.state.coordinate.lng).toFixed(2)}</strong></span>
            </h4>
            <div>
              <h4 className='col-sm-5 lead'>Overall Rate: </h4>
              <input id='rateInput' className='col-sm-5 rating' value={this.state.rate} readOnly='true'></input>
            </div>
            <div className='lead col-sm-10'>Reviews: <strong>{this.state.count}</strong></div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaceInfo;