import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import { helpers, propTypes } from '../../../data/performance';
import { fetch } from '../../../utils';
import CircularProgress from '../../../components/circular_progress';
import { FlexContainer, FlexChild } from '../../../components/flex';
import Performance from '../../../components/performance';
import Snackbar from '../../../components/snackbar';
import Typography from '../../../components/typography';

const formatString = 'MM/DD/YYYY hh:mm A';

class PerformanceIndex extends React.PureComponent {
  static get propTypes() {
    return {
      performances: PropTypes.arrayOf(PropTypes.shape(propTypes.performance))
        .isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      performancesById: props.performances.reduce(
        (acc, { id, date, windowClose, windowOpen, ...rest }) => {
          acc[id] = {
            ...rest,
            id,
            date: moment(new Date(date)).format(formatString),
            windowClose: moment(new Date(windowClose)).format(formatString),
            windowOpen: moment(new Date(windowOpen)).format(formatString)
          };

          return acc;
        },
        {}
      ),
      requesting: false,
      updated: false
    };
    this.handleChallengeListRequest = this.handleChallengeListRequest.bind(
      this
    );
    this.handlePerformanceDelete = this.handlePerformanceDelete.bind(this);
    this.handlePerformanceUpdate = this.handlePerformanceUpdate.bind(this);
  }

  handleChallengeListRequest(performanceId) {
    this.setState({ requesting: true });
    helpers
      .getChallengeList(performanceId)
      .then(() => {
        this.setState({ requesting: false });
      })
      .catch(() => {
        this.setState({ requesting: false });
      });
  }

  handlePerformanceDelete({ id }) {
    this.setState({ deleted: false, requesting: true });
    helpers.del(id).then(() => {
      this.setState(({ performancesById }) => {
        const newPerformances = { ...performancesById };

        delete newPerformances[id];

        return {
          deleted: true,
          performancesById: { ...newPerformances },
          requesting: false
        };
      });
    });
  }

  handlePerformanceUpdate({ id, ...rest }) {
    this.setState({ requesting: true, updated: false });
    helpers.update({ id, ...rest }).then(() => {
      this.setState(({ performancesById }) => ({
        performancesById: {
          ...performancesById,
          [id]: {
            id,
            ...rest
          }
        },
        updated: true,
        requesting: false
      }));
    });
  }

  render() {
    const { deleted, performancesById, requesting, updated } = this.state;
    const sortedKeys = Object.keys(performancesById).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );
    let snackbarMessage = 'Updated Performance';

    if (deleted) {
      snackbarMessage = 'Deleted Performance';
    }

    return (
      <FlexContainer
        flexDirection="column"
        alignItems="center"
        margin="20px 0"
        opacity={requesting ? 0.5 : 1}
      >
        <Typography category="display" number={2}>
          Update Performances
        </Typography>
        <FlexChild flex={1} padding="20px 0 0 0" width="100%">
          {sortedKeys.length > 0
            ? <FlexContainer justifyContent="center" flexWrap="wrap">
                {sortedKeys.map(id =>
                  <Performance
                    key={id}
                    buttonText="Update"
                    canDelete
                    onAction={this.handlePerformanceUpdate}
                    onChallengeListRequest={this.handleChallengeListRequest}
                    onDelete={this.handlePerformanceDelete}
                    performance={performancesById[id]}
                  />
                )}
              </FlexContainer>
            : <Link to="/performances/create">Create A Performance</Link>}
        </FlexChild>
        <Snackbar show={updated || deleted} message={snackbarMessage} />
        {requesting && <CircularProgress />}
      </FlexContainer>
    );
  }
}

export default fetch(helpers.getAll, null, PerformanceIndex);
