import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import { Redirect } from 'react-router-dom';
import { useQuery } from 'react-query';
import Axios from 'axios';

import { HOME, EDIT_COURSE } from '../contants/paths';
import Error from '../components/Error';
import NewCourse from '../components/NewCourse';
import Loading from '../components/Loading';
import CourseList from '../components/CourseList';

const fetchCoursesByCreatedBy = (userId) => async () => {
  if (!userId) return [];

  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        query courses{
          courses{
            id
            title
            cover
            description
            createdBy {
              id
            }
          }
        }
      `,
    },
  });

  const listData = resp?.data?.data?.courses ?? [];
  const myCourseCreated = listData.filter(
    (course) => course?.createdBy?.id === userId
  );
  return myCourseCreated;
};

function Instructor() {
  const classes = useStyles();
  const { isLoggedIn, user } = useStoreState(
    (state) => state.auth
  );
  const { status, data, error } = useQuery(
    'coursesCreatedBy',
    fetchCoursesByCreatedBy(user?.id ?? '')
  );

  const { isStudent } = useStoreState((state) => state.ui);

  if (!isLoggedIn || isStudent) return <Redirect to={HOME} />;

  return (
    <div className={classes.container}>
      <Error error={error} status={status} />
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">Created Courses</Typography>
        </Grid>
        <Grid item>
          <NewCourse />
        </Grid>
      </Grid>
      <div className={classes.container}>
        {status === 'error' && (
          <Error status={status} error={error} />
        )}
        {status === 'loading' ? (
          <Loading color="blue" />
        ) : (
          <CourseList list={data} pathDetailItem={EDIT_COURSE} />
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.container.primary,
    margin: '0 auto',
    marginTop: theme.marginTop.container,
  },
}));
export default Instructor;
