import React from 'react';
import HomeActions from '../actions/HomeActions';
import HomeStore from '../stores/HomeStore';
import {assign} from 'underscore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
    this.stopInputNodes = [];
    this.stopAutocompletes = [];
    this.stopCount = 0;
  }

  /* Place autocomplete input handler */
  autocompleteHandler(placeResult) {

    if (!placeResult.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (placeResult.geometry.viewport) {
      this.map.fitBounds(placeResult.geometry.viewport);
    } else {
      this.map.setCenter(placeResult.geometry.location);
      this.map.setZoom(17);  // Why 17? Because it looks good.
    }

    if (placeResult.address_components) {
      if (placeResult.inputId == 'origin') {
        HomeActions.updateOrigin(placeResult);
      } else if (placeResult.inputId == 'destination') {
        HomeActions.updateDestination(placeResult);
      } else {
        HomeActions.updateStops(placeResult);
      }
    }
  }

  initMap() {
    /* Initiate the google map object  */
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.421440, lng: -89.262108},
      zoom: 6
    });

    /* Get the input element node */
    var originInput = document.getElementById('originInput');
    var destinationInput = document.getElementById('destinationInput');

    /* initiate the direction service and display */
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);

    /* initiate autocomplete objects */
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'ca'}
    }
    var originAutocomplete = new google.maps.places.Autocomplete(originInput, options);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, options);

    /* Add place_changed event listener to those input elements */
    originAutocomplete.addListener('place_changed', () => {
      var place = originAutocomplete.getPlace();
      assign(place, {inputId: 'origin'});
      this.autocompleteHandler(place);
    });

    destinationAutocomplete.addListener('place_changed', () => {
      var place = destinationAutocomplete.getPlace();
      assign(place, {inputId: 'destination'});
      this.autocompleteHandler(place);
    });

  }

  initMapMarkers() {
    /* Get the places basic info */
    HomeActions.getPlacesInfo(this.updateMapMarkers.bind(this));
  }

  updateMapMarkers() {
    if (this.state.placesInfo.length == 0) {
      toastr.Error('Fail to add place marker');
      return;
    }

    this.state.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.state.markers = [];

    /* Literal each place and generate a marker on the map */
    this.state.placesInfo.forEach((placeInfo) => {
      var marker = new google.maps.Marker({
        position: placeInfo.coordinate,
        map: this.map,
        title: placeInfo.name,
        anchorPoint: new google.maps.Point(0, -29)
      });

      /* Initiate an info window for each marker */
      var contentString = '<div>' +
        '<h5><a href="/places/' + placeInfo.name + '">' + placeInfo.name.toUpperCase() + '</a></h5>' +
        '<h5>Overall: ' + placeInfo.review.overall.toFixed(2) + ' /5</h5>' +
        '<h5>Food: ' + placeInfo.review.food.toFixed(2) + ' /5</h5>' +
        '<h5>Entertainment: ' + placeInfo.review.entertainment.toFixed(2) + ' /5</h5>' +
        '<h5>Traffic: ' + placeInfo.review.traffic.toFixed(2) + ' /5</h5>' +
        '<h5>Beauty: ' + placeInfo.review.beauty.toFixed(2) + ' /5</h5>' +
        '<h5>Description: ' + placeInfo.description + '</h5>' +
      '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });

      /* Add click event listener to each marker */
      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
        setTimeout(function(){infowindow.close()}, 3000);
      })

      this.state.infoWindows.push(infowindow);
      this.state.markers.push(marker);

    });
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    this.initMap();
    this.initMapMarkers();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.state.origin.location,
      destination: this.state.destination.location,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: this.state.wayPoints
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        HomeActions.invalidDirectionRequest(status);
      }
    });
  }

  searchHandler(event) {
    event.preventDefault();

    var origin = this.state.origin.name.trim();
    var destination = this.state.destination.name.trim();
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

    if (origin && destination && favorite != 'Favorite') {
      var callback = this.calculateAndDisplayRoute.bind(this);
      HomeActions.getWayPoints(this.state.origin, this.state.destination, favorite, callback);
    }
  }

  updateStopInputNodes() {
    /* Get the stop input element node */
    for(var i=0; i<this.stopCount; i++) {
      let stopId = 'stop-' + i;
      this.stopInputNodes.push(document.getElementById(stopId));
    }

    /* Add autocomplete */
    this.stopInputNodes.forEach((inputNode, index)=> {
      let options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'ca'}
      }
      var stopAutocomplete = new google.maps.places.Autocomplete(inputNode, options);

      stopAutocomplete.addListener('place_changed', () => {
        var place = stopAutocomplete.getPlace();
        assign(place, {inputId: inputNode.id});

        this.autocompleteHandler(place, 'stops');
      });

      this.stopAutocompletes[inputNode.id] = stopAutocomplete;
    });
  }

  addStopHandler(event) {
    event.preventDefault();

    this.stopCount++;
    this.forceUpdate(this.updateStopInputNodes.bind(this));
  }

  deleteStopHandler(stopId) {
    HomeActions.deleteStop(stopId);
    document.getElementById(stopId).parentElement.parentElement.className = 'col-xs-12 fadeOut animated'
    setTimeout(()=>{document.getElementById(stopId).parentElement.parentElement.style.display = 'none';}, 1000);
  }

  render() {

    let stopInputs = [];
    for(var i=0; i<this.stopCount; i++) {
      let id = 'stop-'+i;
      if (!this.state.stops[id]) {
        this.state.stops[id] = {name: '', location: {lat: '', lng: ''}};
      }

      stopInputs.push(
        <div key={id} className='col-xs-12 fadeIn animated'>
          <div className='input-group'>
            <input id={id} type='text' className='form-control' value={this.state.stops[id].name} placeholder='Stop ...'
              onChange={HomeActions.updateStopsDisplay} />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.deleteStopHandler.bind(this, id)} >
                <span className="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>
      );
    }

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
                  <input id='originInput' type='text' className='form-control' value={this.state.origin.name} placeholder='From ...'
                    ref='originTextField' onChange={HomeActions.updateOriginDisplay} />
                </div>

                { stopInputs }

                <div className={'col-xs-12 input-goup ' + this.state.destinationValidationState}>
                  <input id='destinationInput' type='text' className='form-control' value={this.state.destination.name} placeholder='To ...'
                    ref='destinationTextField' onChange={HomeActions.updateDestinationDisplay}/>
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
                  <button type='button' className='btn btn-primary' onClick={this.searchHandler.bind(this)} ><span className="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button>
                  <button type='button' className='btn btn-primary' onClick={this.addStopHandler.bind(this)} ><span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Stop</button>
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
              <div id='directionPanel' className='row panel-body'>
                <div className='col-xs-12 list-group'>
                  <a href={'/places/'+this.state.origin.name} className='list-group-item route'>{'Start: ' + this.state.origin.name.toUpperCase()}</a>
                  <a href={'/places/'+this.state.rawWayPoints[0].name} className='list-group-item route'>{'Way Point: ' + this.state.rawWayPoints[0].name.toUpperCase()}</a>
                  <a href={'/places/'+this.state.destination.name} className='list-group-item route'>{'End: ' + this.state.destination.name.toUpperCase()}</a>
                </div>
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