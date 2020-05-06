import React, { useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Add, Remove, PlayCircleFilled } from '@material-ui/icons';
import Axios from 'axios';
import { useQuery } from 'react-query';

import Loading from './Loading';
import Error from './Error';

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

function CourseContent({ courseId }) {
  const classes = useStyles();
  const { data, status, error } = useQuery(
    `sections-${courseId}`,
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
      console.log('ooo', isOpen);
      if (isOpen) {
        setListOpen(listOpen.filter((item) => item !== id));
        return;
      }
      setListOpen([...listOpen, id]);
    },
    [listOpen, isOpenSection]
  );
  const example = [
    {
      id: '1',
      title: 'Course Overview - Start Here',
      lectures: [
        {
          id: '3243',
          title: 'How to Get Help',
        },
      ],
    },
    {
      id: '2',
      title: 'ini',
      lectures: [
        {
          id: '3243',
          title: 'How to Get Help',
        },
      ],
    },
  ];
  const countLectures = useMemo(
    () =>
      example
        ?.map((item) => item?.lectures?.length ?? 0)
        ?.reduce((acc, value) => acc + value, 0) ?? 0,
    [example]
  );
  const [isExpandAll, setIsExpand] = useState(false);
  const toogleExpand = useCallback(() => {
    const listId = isExpandAll
      ? []
      : example.map((item) => item.id);
    setListOpen(listId);
    setIsExpand(!isExpandAll);
  }, [example, isExpandAll]);

  return (
    <div className={classes.container}>
      <Error message={error} status={status} />
      <Grid container spacing={2} style={{ marginBottom: '2rem' }}>
        <Grid item sm={6}>
          <Typography variant="h6">Course Content</Typography>
        </Grid>
        <Grid item sm={6}>
          <Grid container justify="flex-end" spacing={4}>
            <Grid item>
              <Button onClick={toogleExpand}>
                {isExpandAll ? 'Hide All' : 'Expand All'}
              </Button>
            </Grid>
            <Grid
              item
              style={{ display: 'flex', alignItems: 'center' }}>
              {countLectures} lectures
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {status === 'loading' ? (
        <Loading />
      ) : (
        <div>
          {example.map((section) => (
            <div
              key={section.id}
              className={classes.containerSection}>
              <div
                onClick={handleToggle(section.id)}
                className={classes.section}>
                <Grid
                  container
                  spacing={2}
                  justify="space-between">
                  <Grid item xs={8}>
                    <Grid
                      container
                      alignItems="center"
                      spacing={2}>
                      <Grid item>
                        {!isOpenSection(section.id) ? (
                          <Add />
                        ) : (
                          <Remove />
                        )}
                      </Grid>
                      <Grid item>
                        <Typography>{section.title}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container justify="space-between">
                      <Grid item>
                        {section.lectures.length} lectures
                      </Grid>
                      <Grid item>00:00</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              {isOpenSection(section.id) && (
                <div>
                  {section.lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className={classes.lecture}>
                      <Grid container justify="space-between">
                        <Grid item xs={8}>
                          <Grid container spacing={2}>
                            <Grid item>
                              <PlayCircleFilled />
                            </Grid>
                            <Grid item>{lecture.title}</Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={4}>
                          <Grid container justify="flex-end">
                            <Grid item>00:00</Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1.8rem',
    boxShadow: '0px 0px 4px rgba(5, 5, 5, 0.08)',
    borderRadius: '8px',
    marginBottom: '1.2rem',
    width: '100%',
  },
  containerSection: {
    marginBottom: '8px',
  },
  section: {
    background: '#F0F2F5',
    border: '1px solid #D5D8DC',
    borderRadius: '4px',
    padding: '0.8rem  2rem',
    cursor: 'pointer',
  },
  lecture: {
    border: '1px solid #D5D8DC',
    borderRadius: '4px',
    padding: '0.8rem  2rem 0.8rem 3.2rem',
    cursor: 'pointer',
  },
}));

export default CourseContent;
