import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';

import './current-challenge.scss';
import { api } from '../utils';

export default class CurrentChallenge extends Component {

  static get propTypes() {
    return {
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      spotId: PropTypes.string.isRequired
    };
  }

  constructor() {
    super();
    this.state = {
      deleted: false
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    api.del(`/challenges/${this.props.id}`)
    .then(() => {
      this.setState({
        deleted: true
      });
    });
  }

  render() {
    const paperStyle = {
      height: '100px'
    };

    if (this.state.deleted) {
      return (
        <Paper style={paperStyle}>
          <h2 className="CurrentChallenge-header">Successfully deleted challenge. Remember to go make another</h2>
        </Paper>
      );
    }

    return (
      <Paper style={paperStyle}>
        <div className="CurrentChallenge">
          <h2 className="CurrentChallenge-header">Challenging spot {this.props.spotId} for the {this.props.name}</h2>
          <div className="CurrentChallenge-button" onTouchTap={this.handleDelete}>
            Delete
          </div>
        </div>
      </Paper>
    );
  }
}
