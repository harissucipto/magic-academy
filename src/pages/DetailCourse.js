import React from 'react';
import { useParams } from 'react-router-dom';
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

  return (
    <div className={classes.container}>
      <Error message={error} status={status} />
      {status === 'loading' && <Loading />}

      {status !== 'loading' && data && (
        <div>
          <div className={classes.courseSummary}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <Typography variant="h5">
                  {data?.title ?? '-'}
                </Typography>
                <br />
                <Typography variant="subtitle1">
                  {data?.description ?? '-'}
                </Typography>
                <br />
                <Button variant="contained">
                  Enroll in Course
                </Button>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className={classes.cover} />
              </Grid>
            </Grid>
          </div>

          <CourseContent courseId={id} />
        </div>
      )}
    </div>
  );
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
    backgroundColor: 'grey',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    marginBottom: '5px',
    borderRadius: '4px 4px 0px 0px',
  },
  courseSummary: {
    padding: '1.8rem',
    boxShadow: '0px 0px 4px rgba(5, 5, 5, 0.08)',
    borderRadius: '8px',
    marginBottom: '1.2rem',
  },
}));

export default DetailCourse;
