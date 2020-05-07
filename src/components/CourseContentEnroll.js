import React, { useState, useCallback, useEffect } from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
  PlayCircleFilled,
} from '@material-ui/icons';
import Axios from 'axios';
import { useQuery } from 'react-query';

import Loading from './Loading';
import Error from './Error';
import { Alert } from '@material-ui/lab';
import ViewSection from './ViewSection';

const fetchSectionsByIdCourse = (courseId) => async () => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        query sections($courseId: String!) {
          sections(
            where: {
              courseId: $courseId
            }
          ){
            id
            title
            lectures {
              id
              title
              embedLink
              description
            }
          }
        }
      `,
      variables: {
        courseId,
      },
    },
  });

  return resp?.data?.data?.sections ?? null;
};

function CourseContentEnroll({ courseId, isEnroll }) {
  const classes = useStyles();
  const { data, status, error } = useQuery(
    `sections-courseId-${courseId}`,
    fetchSectionsByIdCourse(courseId)
  );
  const [listOpen, setListOpen] = useState([]);
  const isOpenSection = useCallback(
    (id) => listOpen.some((item) => item === id),
    [listOpen]
  );
  const handleToggle = useCallback(
    (id) => () => {
      const isOpen = isOpenSection(id);
      if (isOpen) {
        setListOpen(listOpen.filter((item) => item !== id));
        return;
      }
      setListOpen([...listOpen, id]);
    },
    [listOpen, isOpenSection]
  );

  // const countLectures = useMemo(
  //   () =>
  //     data
  //       ?.map((item) => item?.lectures?.length ?? 0)
  //       ?.reduce((acc, value) => acc + value, 0) ?? 0,
  //   [data]
  // );

  const [selectView, setSelectView] = useState(null);
  useEffect(() => {
    if (data && data.length) {
      setSelectView(data[0].lectures[0]);
    }
  }, [data]);

  const isSelectedSection = useCallback(
    (id) => {
      if (!selectView) return false;
      if (!data) return false;
      const section = data.find((section) =>
        section.lectures.some(
          (lecture) => lecture.id === selectView.id
        )
      );
      if (!section) return false;

      return section.id === id;
    },
    [selectView, data]
  );

  const handleChangeView = useCallback(
    (lecture) => () => {
      setSelectView(lecture);
    },
    []
  );
  return (
    <Grid container spacing={4}>
      <Grid item xs={!2} md={8}>
        <ViewSection
          data={selectView}
          isLoading={status === 'loading'}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <div className={classes.container}>
          <Error message={error} status={status} />
          <Grid
            container
            spacing={2}
            style={{ marginBottom: '1rem' }}>
            <Grid item>
              <Typography variant="h6">Course Content</Typography>
            </Grid>
          </Grid>

          {status === 'loading' ? (
            <Loading />
          ) : (
            <div>
              {data.map((section) => (
                <div
                  key={section.id}
                  className={classes.containerSection}>
                  <div
                    onClick={handleToggle(section.id)}
                    className={classes.section}>
                    <Grid container justify="space-between">
                      <Grid item xs={12}>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                          spacing={2}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              {section.title}
                            </Typography>
                          </Grid>
                          <Grid item>
                            {!isOpenSection(section.id) ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item>
                            <Typography variant="subtitle2">
                              N Minutes. 0 /{' '}
                              {section.lectures.length}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                  {isOpenSection(section.id) ||
                  isSelectedSection(section.id) ? (
                    <div>
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className={classes.lecture}
                          onClick={handleChangeView(lecture)}>
                          <Grid container justify="space-between">
                            <Grid item xs={8}>
                              <Grid container spacing={2}>
                                <Grid item>
                                  <PlayCircleFilled fontSize="small" />
                                </Grid>
                                <Grid item>
                                  <Typography
                                    variant="subtitle2"
                                    color={
                                      selectView.id === lecture.id
                                        ? 'primary'
                                        : 'initial'
                                    }>
                                    {lecture.title}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    N minutes
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {status !== 'loading' && !data?.length && (
                <Alert severity="warning">
                  Lectures Not Found
                </Alert>
              )}
            </div>
          )}
        </div>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    boxShadow: '0px 0px 4px rgba(5, 5, 5, 0.08)',
    borderRadius: '8px',
    marginBottom: '1.2rem',
    width: '100%',
  },
  containerSection: {},
  section: {
    border: '1px solid #D5D8DC',
    borderRadius: '4px',
    padding: '0.8rem',
    cursor: 'pointer',
  },
  lecture: {
    border: '1px solid #D5D8DC',
    borderRadius: '4px',
    padding: '0.8rem',
    cursor: 'pointer',
  },
}));

export default CourseContentEnroll;
