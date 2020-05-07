import React from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';
import { makeStyles, Typography } from '@material-ui/core';

import Loading from '../components/Loading';
import Error from '../components/Error';
import CourseList from '../components/CourseList';
import { ENROLL, HOME } from '../contants/paths';
import { Alert } from '@material-ui/lab';
import { Redirect } from 'react-router-dom';

const fetchMyCourses = (ids) => async () => {
  if (!ids.length) return [];
  const resp = async (id) =>
    await Axios.request({
      baseURL:
        'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
      method: 'post',
      data: {
        query: `
        query course($id: String! ){
          course(
              id: $id
          ) {
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

  const listRequest = ids.map((id) => {
    return resp(id);
  });
  const esktrak = (resp) => resp?.data?.data?.course ?? null;
  const hasil2 = (await Promise.all(listRequest)).map((item) =>
    esktrak(item)
  );
  return hasil2;
};

function MyCourse() {
  const { myCourse } = useStoreState((state) => state.enroll);
  const { status, data, error } = useQuery(
    'myCourses',
    fetchMyCourses(myCourse)
  );
  const classes = useStyles();

  const { isStudent } = useStoreState((state) => state.ui);
  const { isLoggedIn } = useStoreState((state) => state.auth);

  if (!isStudent || !isLoggedIn) return <Redirect to={HOME} />;

  return (
    <div className={classes.container}>
      <Typography className={classes.text1}>
        Courses Enroll
      </Typography>
      <br />
      {status === 'error' && (
        <Error status={status} error={error} />
      )}
      {status !== 'loading' && data && !data.length && (
        <>
          <br />
          <Alert severity="info">
            you dont have a course, please enroll to enjoy
            learning!
          </Alert>
        </>
      )}
      {status === 'loading' ? (
        <Loading color="blue" />
      ) : (
        <CourseList list={data} pathDetailItem={ENROLL} />
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.container.primary,
    margin: '0 auto',
    marginTop: theme.marginTop.container,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    lineHeight: '1.9375rem',
    color: '#050505',
  },
}));

export default MyCourse;
