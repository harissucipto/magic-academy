import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Loading from './Loading';
import { Alert } from '@material-ui/lab';

function ViewSection({ data, loading }) {
  const classes = useStyles();

  if (loading) return <Loading />;
  if (!data) return <Alert severity="info">Data Not Found</Alert>;
  return (
    <div>
      <div className={classes.videoContainer}>
        <iframe
          className={classes.videoPlayer}
          src={data.embedLink}
          frameBorder="0"
          title="enroll=vidoe"
        />
      </div>
      <br />
      <Typography variant="h5">{data.title}</Typography>
      <br />
      <Typography variant="subtitle1">
        {data.description}
      </Typography>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.container.tiga,
    margin: '0 auto',
    marginTop: theme.marginTop.container,
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%' /* 16:9 */,
    paddingTop: 25,
    height: 0,
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}));

export default ViewSection;
