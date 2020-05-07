import React, { useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import Error from '../components/Error';
import CourseContent from '../components/CourseContent';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Alert } from '@material-ui/lab';
import { LOGIN, ENROLL } from '../contants/paths';

const fetchCourseById = (id) => async () => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        query course($id: String!) {
          course(
            id: $id
          ){
            id
            title
            cover
            description
          }
        }
      `,
      variables: {
        id,
      },
    },
  });

  return resp?.data?.data?.course ?? null;
};

function DetailCourse() {
  const { id } = useParams();
  const classes = useStyles();
  const { data, status, error } = useQuery(
    `detailCourse-${id}`,
    fetchCourseById(id)
  );

  const { myCourse } = useStoreState((state) => state.enroll);
  const isEnroll = useMemo(
    () => myCourse.some((item) => item === id),
    [myCourse, id]
  );
  const { isLoggedIn, user } = useStoreState(
    (state) => state.auth
  );
  const { addEnroll } = useStoreActions(
    (actions) => actions.enroll
  );
  const history = useHistory();

  const handleEnroll = () => {
    if (isEnroll) {
      console.log('sudah di enroll');
      return;
    }
    if (!isLoggedIn) {
      history.push(LOGIN);
      return;
    }
    addEnroll({
      courseId: id,
      userId: user.id,
    });
    history.push(`${ENROLL}/${id}`);
  };

  return (
    <div className={classes.container}>
      <Error message={error} status={status} />
      {status === 'loading' && <Loading />}

      {status !== 'loading' && data && (
        <div>
          {isEnroll && (
            <Alert severity="info">
              You already enroll this course, Keep learning!
            </Alert>
          )}
          <div className={classes.courseSummary}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <Typography className={classes.text1}>
                  {data?.title ?? '-'}
                </Typography>
                <Typography className={classes.text2}>
                  {data?.description ?? '-'}
                </Typography>
                {!isEnroll && (
                  <Button
                    className={classes.button}
                    variant="contained"
                    onClick={handleEnroll}>
                    Enroll in Course
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className={classes.cover}>
                  <Typography>
                    {!Boolean(data.cover) &&
                      maximalString(data.title, 100)}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </div>

          <CourseContent courseId={id} isEnroll={isEnroll} />
        </div>
      )}
    </div>
  );
}

function maximalString(text, count) {
  if (!text) return '';

  return text.slice(0, count) + (text.length > count ? '...' : '');
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.container.secondary,
    margin: '0 auto',
    marginTop: theme.marginTop.container,
  },
  cover: {
    width: '100%',
    height: '15rem',
    backgroundColor: theme.color.primary,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '5px',
    borderRadius: '4px 4px 0px 0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: '16px',
  },
  courseSummary: {
    padding: '1.8rem',
    boxShadow: '0px 0px 4px rgba(5, 5, 5, 0.08)',
    borderRadius: '8px',
    marginBottom: '1.2rem',
  },
  text1: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    color: ' #050505',
    marginBottom: '0.75rem',
  },
  text2: {
    fontWeight: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: '#8A8C90',
    marginBottom: '2.25rem',
  },
  button: {
    fontWeight: 'bolder',
    fontSize: '0.875rem',
    color: '#FFFFFF',
    textTransform: 'none',
    backgroundColor: theme.color.primary,
  },
}));

export default DetailCourse;
