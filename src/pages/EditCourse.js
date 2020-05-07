import React from 'react';
import Axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { useQuery } from 'react-query';

import Error from '../components/Error';
import Loading from '../components/Loading';
import Curiculum from '../components/Curiculum';
import { useStoreState } from 'easy-peasy';
import { HOME } from '../contants/paths';

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

function EditCourse() {
  const { id } = useParams();
  const classes = useStyles();
  const { data, status, error } = useQuery(
    `detailCourse-${id}`,
    fetchCourseById(id)
  );

  const { isLoggedIn } = useStoreState((state) => state.auth);

  if (!isLoggedIn) return <Redirect to={HOME} />;

  return (
    <div className={classes.container}>
      <Error message={error} status={status} />
      {status === 'loading' && <Loading />}
      {status !== 'loading' && data && (
        <>
          <div className={classes.courseSummary}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <div className={classes.cover} />
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography variant="subtitle1">
                  {data.title}
                </Typography>
                <Typography variant="subtitle2">
                  {data?.description ?? '-'}
                </Typography>
                <Button variant="outlined">Edit Course</Button>
              </Grid>
            </Grid>
          </div>
          <Curiculum courseId={id} />
        </>
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
    height: '6.9rem',
    backgroundColor: theme.color.primary,
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

export default EditCourse;
