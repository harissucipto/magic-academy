import React from 'react';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import { makeStyles } from '@material-ui/core';
import Error from '../components/Error';
import CourseList from '../components/CourseList';
import { useStoreState } from 'easy-peasy';

const fetchMyCourses = (ids) => async () => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        query courses($ids: [String]! ){
          courses(
            where: {
              id_in: $ids
            }
          ) {
            id
            title
            cover
            description
          }
        }
      `,
      variables: {
        ids,
      },
    },
  });

  return resp?.data?.data?.courses ?? [];
};

function MyCourse() {
  const { myCourse } = useStoreState((state) => state.enroll);
  const { status, data, error } = useQuery(
    'myCourses',
    fetchMyCourses(myCourse)
  );

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h1>My Courses </h1>
      <p>{JSON.stringify(myCourse)}</p>
      {status === 'error' && (
        <Error status={status} error={error} />
      )}
      {status === 'loading' ? (
        <Loading color="blue" />
      ) : (
        <CourseList list={data} />
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

export default MyCourse;
