import PropTypes from 'prop-types';

const challengeableUser = {
  file: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  membersInChallenge: PropTypes.number.isRequired,
  openSpot: PropTypes.bool.isRequired,
  row: PropTypes.string.isRequired
};
const performance = {
  date: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  windowClose: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  windowOpen: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default {
  challengeableUser,
  performance
};
