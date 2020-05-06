import React from 'react';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';

function Error({ message, status }) {
  return status === 'error' ? (
    <div>
      <Alert severity="error">{JSON.stringify(message)}</Alert>
    </div>
  ) : null;
}

Error.defaultProps = {
  message: '',
  status: '',
};

Error.propTypes = {
  message: PropTypes.string,
  status: PropTypes.string,
};

export default Error;
