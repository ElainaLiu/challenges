import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import './update-spot.scss';
import { api } from '../utils';

const validSpotRegex = /^[ABCEFHIJKLMQRSTX][1-9]\d*$/;

export default class UpdateSpot extends Component {

  static get propTypes() {
    return {
      nameNumber: PropTypes.string.isRequired,
      onSpotChange: PropTypes.func.isRequired,
      spotId: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      badInput: false,
      editing: false,
      spotId: props.spotId,
      updating: false
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditingToggle = this.handleEditingToggle.bind(this);
    this.handleSpotIdChange = this.handleSpotIdChange.bind(this);
  }

  handleEdit() {
    const { spotId } = this.state;

    if (!validSpotRegex.test(spotId)) {
      this.setState({ badInput: true });
    } else {
      this.setState({ badInput: false, updating: true });
      api.put('/users', {
        nameNumber: this.props.nameNumber,
        spotId
      })
      .then(() => {
        this.setState({
          editing: false,
          updating: false
        });
        this.props.onSpotChange(spotId);
      });
    }
  }

  handleEditingToggle() {
    this.setState(({ editing }, { spotId }) => ({
      badInput: false,
      editing: !editing,
      spotId
    }));
  }

  handleSpotIdChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { badInput, editing, spotId, updating } = this.state;

    if (!editing) {
      return (
        <div className="UpdateSpot">
          <span className="UpdateSpot-spot">{spotId}</span>
          <button onTouchTap={this.handleEditingToggle}>Edit</button>
        </div>
      );
    }

    return (
      <div className="UpdateSpot">
        <TextField
          className="UpdateSpot-input"
          autoFocus
          errorText={badInput && ' '} // The one space string is so we get the error underline, but no error text
          name="spotId"
          onChange={this.handleSpotIdChange}
          type="text"
          value={spotId}
        />
        <button onTouchTap={this.handleEditingToggle}>Cancel</button>
        <button disabled={updating} onTouchTap={this.handleEdit}>Confirm</button>
      </div>
    );
  }
}
