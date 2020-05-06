import React, { useCallback } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { DETAIL_COURSE } from '../contants/paths';

function CourseItem({ id, title, description, cover }) {
  const classes = useStyles();
  const history = useHistory();

  const onDetailCourse = useCallback(
    () => history.push(`${DETAIL_COURSE}/${id}`),
    [history, id]
  );

  return (
    <div className={classes.container} onClick={onDetailCourse}>
      <div
        className={classes.cover}
        style={{
          backgroundImage: Boolean(cover)
            ? `url("${cover}")`
            : `url("${require(`../img/logo.png`)}")`,
        }}>
        {cover}
      </div>
      <div>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle2">
          {maximalString(description, 28)}
        </Typography>
        <div>{cover}</div>
      </div>
    </div>
  );
}

function maximalString(text, count) {
  if (!text) return '';

  return text.slice(0, count) + (text.length > count ? '...' : '');
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    cursor: 'pointer',
  },
  cover: {
    width: '100%',
    height: '10rem',
    backgroundColor: theme.color.primary,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '5px',
    borderRadius: '4px 4px 0px 0px',
  },
}));

export default CourseItem;
