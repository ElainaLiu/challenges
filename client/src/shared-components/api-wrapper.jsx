import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './api-wrapper.scss';
import { api } from '../utils';

export default class ApiWrapper extends Component {

  static get propTypes() {
    return {
      container: PropTypes.func.isRequired,
      endPoint: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    api.get(this.props.endPoint)
      .then((response) => {
        this.setState({
          data: response
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { container: Container } = this.props;
    const { data } = this.state;

    if (!data) {
      return <div className="ApiWrapper"><CircularProgress /></div>;
    }

    return <Container {...data} />;
  }
}
