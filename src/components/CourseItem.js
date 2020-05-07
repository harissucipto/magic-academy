import React, { useCallback } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

function CourseItem({
  id,
  title,
  description,
  cover,
  pathDetailItem,
}) {
  const classes = useStyles();
  const history = useHistory();

  const onDetailCourse = useCallback(
    () => history.push(`${pathDetailItem}/${id}`),
    [history, id, pathDetailItem]
  );

  return (
    <div className={classes.container} onClick={onDetailCourse}>
      <div
        className={classes.cover}
        style={{
          backgroundImage: Boolean(cover) ? `url("${cover}")` : ``,
        }}>
        <Typography>
          {!Boolean(cover) && maximalString(title, 100)}
        </Typography>
      </div>
      <div>
        <Typography className={classes.text1}>{title}</Typography>
        <Typography variant="subtitle2" className={classes.text2}>
          {maximalString(description, 28)}
        </Typography>
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
    height: '8rem',
    backgroundColor: theme.color.primary,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '5px',
    borderRadius: '4px 4px 0px 0px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bolder',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  text1: {
    fontWeight: '500',
    fontSize: '.87rem',
    lineHeight: '20px',
    color: 'black',
  },
  text2: {
    fontWeight: 'normal',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    color: '#8A8C90',
  },
}));

export default CourseItem;
