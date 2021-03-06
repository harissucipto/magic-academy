import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useParams, Redirect } from 'react-router-dom';
import CourseContentEnroll from '../components/CourseContentEnroll';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { useStoreState } from 'easy-peasy';
import { LOGIN } from '../contants/paths';

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

function Enroll() {
  const { id } = useParams();
  const classes = useStyles();
  const { data, status, error } = useQuery(
    `detailCourse-${id}`,
    fetchCourseById(id)
  );

  const { isLoggedIn } = useStoreState((state) => state.auth);

  if (!isLoggedIn) return <Redirect to={LOGIN} />;

  return (
    <div className={classes.container}>
      {status === 'loading' && <Loading />}
      <Error error={error} status={status} />
      {status !== 'loading' && data && (
        <>
          <Typography variant="h5" className={classes.text1}>
            {data.title}
          </Typography>
          <br />
          <CourseContentEnroll courseId={id} />
        </>
      )}
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
  text1: {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    color: '#050505',
  },
}));

export default Enroll;
