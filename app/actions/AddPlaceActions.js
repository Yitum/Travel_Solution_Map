import alt from '../alt';

class AddPlaceActions {
  constructor() {
    this.generateActions(
      'addCharacterSuccess',
      'addCharacterFail',
      'addPlaceSuccess',
      'addPlaceFail',
      'updateName',
      'updateGender',
      'updateDescription',
      'updatePlaceInfo',
      'updateImage',
      'invalidName',
      'invalidGender',
      'invalidDescription',
      'invalidCoordinate',
      'invalidImage'
    );
  }

  addPlace(name, description, coordinate, image) {
    let reader = new  FileReader();

    reader.onloadend = () => {
      let imageUrl = reader.result;
      let coordinateString = JSON.stringify(coordinate);

      $.ajax({
        type: 'POST',
        url: '/api/places',
        data: {name: name, description: description, coordinate: coordinateString, imageUrl: imageUrl}
      })
        .done((data) => {
          this.actions.addPlaceSuccess(data.message);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          let errorMessage;

          switch(jqXHR.status) {
            case 409:
              errorMessage = 'Name Has Been Used';
              break;
            case 413:
              errorMessage = 'Image Too Large';
              break;
            default:
              errorMessage = 'Error';
          }
          this.actions.addPlaceFail(errorMessage);

          if (jqXHR.status === 413) {
            setTimeout(this.actions.invalidImage, 1000);
          } else if (jqXHR.status === 409) {
            setTimeout(this.actions.invalidName, 1000);
          }
        });
    }

    reader.readAsDataURL(image);
  }
}

export default alt.createActions(AddPlaceActions);