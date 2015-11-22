import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';
import AddPlaceStore from '../stores/AddPlaceStore';
import AddPlaceActions from '../actions/AddPlaceActions';

class AddPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddPlaceStore.getState();
    this.onChange = this.onChange.bind(this);
    this.markers = [];
  }

  initMap() {
    var map = new google.maps.Map(this.refs.googleMap, {
      center: {lat: 48.421440, lng: -89.262108},
      zoom: 15
    });
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bound_changed', function(){
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();

      if(places.length == 0) {
        return;
      }

      // Clean the markers
      this.state.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      this.state.markers = [];

      var bounds = new google.maps.LatLngBounds();

      // Create new markers accoring to the input place
      places.forEach((place) => {
        let newMarker = new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location
        });
        newMarker.addListener('click', function(event) {
          AddPlaceActions.updateCoordinate(event);
        });

        this.state.markers.push(newMarker);
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
    });
  }

  componentDidMount() {
    AddPlaceStore.listen(this.onChange);
    this.initMap();
  }

  componentWillUnmount() {
    AddPlaceStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
    console.log('State in AddPlace component has been updated');
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.state.name.trim();
    var gender = this.state.gender;
    var description = this.state.description.trim();
    var coordinate = {
      'lat': this.state.coordinate.lat.trim(),
      'lng': this.state.coordinate.lng.trim()
    };
    var imageUrl = this.state.imageUrl;

    if (!name) {
      AddPlaceActions.invalidName();
      this.refs.nameTextField.focus();
    }

    if (!gender) {
      AddPlaceActions.invalidGender();
    }

    if (!description) {
      AddPlaceActions.invalidDescription();
      this.refs.descriptionTextField.focus();
    }

    if (!coordinate.lat) {
      AddPlaceActions.invalidCoordinate();
      this.refs.latTextField.focus();
    }

    if (!coordinate.lng) {
      AddPlaceActions.invalidCoordinate();
      this.refs.lngTextField.focus();
    }

    if (!imageUrl) {
      AddPlaceActions.invalidImage();
      this.refs.imageElement.focus();
    }

    if (name && description && coordinate.lat && coordinate.lng && imageUrl) {
      AddPlaceActions.addPlace(name, description, {'lat': coordinate.lat, 'lng': coordinate.lng}, imageUrl);
    }
  }

render() {
    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-10'>

            <div className='panel panel-default'>
              <div className='panel-heading'>Add Place</div>
              <div className='panel-body'>
                <form className='form-horizontal' onSubmit={this.handleSubmit.bind(this)}>
                  <div className={'form-group ' + this.state.nameValidationState}>
                    <label className='control-label col-sm-2'>Name</label>
                    <div className='col-sm-8'>
                      <input type='text' className='form-control' ref='nameTextField' value={this.state.name} onChange={AddPlaceActions.updateName} autoFocus/>
                    </div>
                  </div>

                  <div className={'form-group ' + this.state.descriptionValidationState}>
                    <label className='control-label col-sm-2'>Description</label>
                    <div className='col-sm-8'>
                      <input type='text' className='form-control' ref='descriptionTextField' value={this.state.description} onChange={AddPlaceActions.updateDescription} />
                    </div>
                  </div>

                  <div className={'form-group ' + this.state.coordinateValidationState}>
                    <label className='col-sm-2 control-label'>Coordinate</label>
                    <div className='col-sm-2'>
                      <input type='text' className="form-control" ref="latTextField" value={this.state.coordinate.lat} onChange={AddPlaceActions.updateCoordinateLat}/>
                      <div className='help'>Latitude</div>
                    </div>
                    <div className='col-sm-2'>
                      <input type='text' className="form-control" ref="lngTextField" value={this.state.coordinate.lng} onChange={AddPlaceActions.updateCoordinateLng}/>
                      <div className='help'>Longitude</div>
                    </div>
                  </div>

                  <div className={'form-group ' + this.state.imageValidationState}>
                    <label className='control-label col-sm-2'>Image</label>
                    <div className='col-sm-8'>
                      <input type='file' className='form-control' ref='imageElement' src={this.state.imageUrl} onChange={AddPlaceActions.updateImage} />
                      <div className='help'>Image Size Should less than 5MB</div>
                    </div>
                  </div>
                  <div className='col-sm-offset-2'>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                </form>
              </div>
            </div>
            <input id='pac-input' ref='pac-input' className='type-selector' type='text' placeholder='Search Box' />
            <div id='googleMap' ref='googleMap' style={{height:300}}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlace;