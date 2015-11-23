import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.421440, lng: -89.262108},
      zoom: 15
    });
  }

  componentDidMount() {
    this.initMap();
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
                <div className='col-xs-12 input-goup'>
                  <input type='text' className='form-control' placeholder='From ...' aria-describedby='basic-addon1' />
                </div>
                <div className='col-xs-12 input-goup'>
                  <input type='text' className='form-control' placeholder='To ...' aria-describedby='basic-addon1' />
                </div>
                <div className="col-xs-12 btn-group">
                  <button type="button" className="btn btn-default">Favorite</button>
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a href="#">Food</a></li>
                    <li><a href="#">Entertainment</a></li>
                    <li><a href="#">Traffic</a></li>
                    <li><a href="#">Beauty</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Distance</a></li>
                  </ul>
                </div>
                <div className='col-xs-12 search-button'>
                  <button type='button' className='btn btn-primary'>Search</button>
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