import React from 'react';
import HomeActions from '../actions/HomeActions';
import HomeStore from '../stores/HomeStore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.421440, lng: -89.262108},
      zoom: 15
    });
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    this.initMap();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  searchHandler(event) {
    event.preventDefault();

    var origin = this.state.origin.trim();
    var destination = this.state.destination.trim();
    var favorite = this.state.favorite;

    if (!origin) {
      HomeActions.invalidOrigin();
      this.refs.originTextField.focus();
    }

    if (!destination) {
      HomeActions.invalidDestination();
      this.refs.destinationTextField.focus();
    }

    if (favorite == 'Favorite') {
      HomeActions.invalidFavorite();
    }
  }


  render() {
    return (
      <div className='container-fluid map-container row'>
        <div className='col-xs-3 map-panel'>
          {/* Search Box panel */}
          <div className='col-xs-12 map-panel-searchbox'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                <h3 className='panel-title'>Start Your Trip!</h3>
              </div>
              <div className='row panel-body'>
                <div className={'col-xs-12 input-goup ' + this.state.originValidationState}>
                  <input type='text' className='form-control' value={this.state.origin} placeholder='From ...'
                    ref='originTextField' aria-describedby='basic-addon1' onChange={HomeActions.updateOrigin} />
                </div>
                <div className={'col-xs-12 input-goup ' + this.state.destinationValidationState}>
                  <input type='text' className='form-control' value={this.state.destination} placeholder='To ...'
                    ref='destinationTextField' aria-describedby='basic-addon1' onChange={HomeActions.updateDestination} />
                </div>
                <div className='col-xs-12 btn-group'>
                  <button type="button" className={'btn ' + this.state.favoriteValidationState}>{this.state.favorite}</button>
                  <button type="button" className={'btn dropdown-toggle ' + this.state.favoriteValidationState} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a value='Food' onClick={HomeActions.updateFavorite.bind(this, 'Food')}>Food</a></li>
                    <li><a value='Entertainment' onClick={HomeActions.updateFavorite.bind(this, 'Entertainment')}>Entertainment</a></li>
                    <li><a value='Traffic' onClick={HomeActions.updateFavorite.bind(this, 'Traffic')}>Traffic</a></li>
                    <li><a value='Beauty' onClick={HomeActions.updateFavorite.bind(this, 'Beauty')}>Beauty</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a name='Distance' onClick={HomeActions.updateFavorite.bind(this, 'Distance')}>Distance</a></li>
                  </ul>
                </div>
                <div className='col-xs-12 search-button'>
                  <button type='button' className='btn btn-primary' onClick={this.searchHandler.bind(this)} >Search</button>
                  <span className='help-block'>{this.state.helpBlock}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Search Route panel */}
          <div className='col-xs-12 map-panel-route'>
            <div className='panel panel-default'>
              <div className='panel-heading'>
                  <h3 className='panel-title'>Route</h3>
              </div>
              <div className='row panel-body'>
              </div>
            </div>
          </div>
        </div>
        <div id='map' className='col-xs-9 map-box'></div>
      </div>
    );
  }
}

export default Home;