import React from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import { makeStyles } from '@material-ui/core';
import Error from '../components/Error';
import CourseList from '../components/CourseList';
import { DETAIL_COURSE } from '../contants/paths';

const fetchCourses = async () => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        query {
          courses(limit: 200){
            id
            title
            cover
            description
          }
        }
      `,
    },
  });

  return resp?.data?.data?.courses ?? [];
};

function Home() {
  const { status, data, error } = useQuery(
    'courses',
    fetchCourses
  );

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {status === 'error' && (
        <Error status={status} error={error} />
      )}
      {status === 'loading' ? (
        <Loading color="blue" />
      ) : (
        <CourseList list={data} pathDetailItem={DETAIL_COURSE} />
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
}));

export default Home;
