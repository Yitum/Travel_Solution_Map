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

    var placeName = document.getElementById('placeName');
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'ca'}
    }
    var autocomplete = new google.maps.places.Autocomplete(placeName, options);
    autocomplete.bindTo('bounds', map);

    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });


    autocomplete.addListener('place_changed', () => {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }

      marker.setPosition(place.geometry.location);

      if (place.address_components) {
        AddPlaceActions.updatePlaceInfo(place);
      }
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
    var description = this.state.description.trim();
    var coordinate = this.state.coordinate;
    var imageUrl = this.state.imageUrl;

    if (!name || !coordinate.lat || !coordinate.lng) {
      AddPlaceActions.invalidName();
      this.refs.nameTextField.focus();
    }

    if (!description) {
      AddPlaceActions.invalidDescription();
      this.refs.descriptionTextField.focus();
    }

    if (!imageUrl) {
      AddPlaceActions.invalidImage();
      this.refs.imageElement.focus();
    }

    if (name && description && coordinate.lat && coordinate.lng && imageUrl) {
      AddPlaceActions.addPlace(name, description, coordinate, imageUrl);
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
                      <input id='placeName' type='text' className='form-control' ref='nameTextField' value={this.state.name} onChange={AddPlaceActions.updateName} autoFocus/>
                    </div>
                  </div>

                  <div className={'form-group ' + this.state.descriptionValidationState}>
                    <label className='control-label col-sm-2'>Description</label>
                    <div className='col-sm-8'>
                      <input type='text' className='form-control' ref='descriptionTextField' value={this.state.description} onChange={AddPlaceActions.updateDescription} />
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
            <div id='googleMap' ref='googleMap' style={{height:300}}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlace;