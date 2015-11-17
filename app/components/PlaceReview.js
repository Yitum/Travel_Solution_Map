import React from 'react';
import PlaceReviewActions from '../actions/PlaceReviewActions';
import PlaceReviewStore from '../stores/PlaceReviewStore';

class PlaceReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = PlaceReviewStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PlaceReviewStore.listen(this.onChange);

    $('.rating').rating({
      size: 'xs',
      showClear: false,
      showCaption: false,
      min: 0,
      max: 5
    });

    $('.rating').on('rating.change', function(event, value, caption) {
        switch(event.target.id) {
          case 'rateFoodInpute':
            PlaceReviewActions.updateFoodRate(event);
            break;
          case 'rateEntertainmentInput':
            PlaceReviewActions.updateEntertainmentRate(event);
            break;
          case 'rateTrafficInput':
            PlaceReviewActions.updateTrafficRate(event);
            break;
          case 'rateBeautyInput':
            PlaceReviewActions.updateBeautyRate(event);
            break;
        }
    });
  }

  componentWillUnmount() {
    PlaceReviewStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
    $('#rateFoodInpute').rating('update', this.state.food);
    $('#rateTrafficInput').rating('update', this.state.traffic);
    $('#rateEntertainmentInput').rating('update', this.state.entertainment);
    $('#rateBeautyInput').rating('update', this.state.beauty);
  }

  handleSubmit(event) {
    event.preventDefault();

    var food = this.state.food;
    var entertainment = this.state.entertainment;
    var traffic = this.state.traffic;
    var beauty = this.state.beauty;
    var author = this.state.comment.author.trim();
    var text = this.state.comment.text.trim();

    if (!food) {
      PlaceReviewActions.invalidFoodRate();
    }
    if (!entertainment) {
      PlaceReviewActions.invalidEntertainmentRate();
    }
    if (!traffic) {
      PlaceReviewActions.invalidTrafficRate();
    }
    if (!beauty) {
      PlaceReviewActions.invalidBeautyRate();
    }
    if (!author) {
      PlaceReviewActions.invalidAuthor();
    }
    if (!text) {
      PlaceReviewActions.invalidText();
    }

    if (food && entertainment && traffic && beauty && author &&  text) {
      PlaceReviewActions.addReview(this.props.placename, food, entertainment, traffic, beauty, author, text);
    }
  }

  render() {
    return(
      <div className='container'>
        <div className='col-sm-10'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Rate</div>
            <div className='panel-body'>
              <form onSubmit={this.handleSubmit.bind(this)} noValidate >
                <div className={'form-group ' + this.state.foodValidationState}>
                  <label className='control-label'>Food</label>
                  <input id='rateFoodInpute' type='number' className='rating' value={this.state.food} onChange={PlaceReviewActions.updateFoodRate}></input>
                </div>
                <div className={'form-group ' + this.state.entertainmentValidationState}>
                  <label className='control-label'>Entertainment</label>
                  <input id='rateEntertainmentInput' type='number' className='rating' value={this.state.entertainment} onChange={PlaceReviewActions.updateEntertainmentRate}></input>
                </div>
                <div className={'form-group ' + this.state.trafficValidationState}>
                  <label className='control-label'>Traffic</label>
                  <input id='rateTrafficInput' type='number' className='rating' value={this.state.traffic} onChange={PlaceReviewActions.updateTrafficRate}></input>
                </div>
                <div className={'form-group ' + this.state.beautyValidationState}>
                  <label className='control-label'>Beauty</label>
                  <input id='rateBeautyInput' type='number' className='rating' value={this.state.beauty} onChange={PlaceReviewActions.updateBeautyRate}></input>
                </div>
                <div className={'form-group ' + this.state.authorValidationState}>
                  <label className='control-label'>Your Name</label>
                  <input type='text' className='form-control' ref='nameInputField' value={this.state.author} onChange={PlaceReviewActions.updateAuthor}></input>
                </div>
                <div className={'form-group ' + this.state.textValidationState}>
                  <label className='control-label'>Your Comment</label>
                  <textarea className='form-control' rows='5' ref='commentInputField' value={this.state.text} onChange={PlaceReviewActions.updateText} ></textarea>
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
                <span className='help-block'>{this.state.helpBlock}</span>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaceReview;