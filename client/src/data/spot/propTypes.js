import PropTypes from 'prop-types';

import helpers from './helpers';

const propTypes = {
  file: PropTypes.number,
  row: PropTypes.oneOf(Object.values(helpers.rows))
};

export default propTypes;
