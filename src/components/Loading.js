import React from 'react';
import { CircularProgress } from '@material-ui/core';

function Loading({ color = 'white' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color="inherit" />
    </div>
  );
}

export default Loading;
