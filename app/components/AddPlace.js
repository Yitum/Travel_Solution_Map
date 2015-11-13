import React from 'react';
import AddPlaceStore from '../stores/AddPlaceStore';
import AddPlaceActions from '../actions/AddPlaceActions';

class AddPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddPlaceStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddPlaceStore.listen(this.onChange);
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
          </div>
        </div>
      </div>
    );
  }
}

export default AddPlace;


