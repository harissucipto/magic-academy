import React, { useState, useCallback } from 'react';
import {
  Grid,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import FormNewSection from './FormNewSection';
import Axios from 'axios';
import { useQuery } from 'react-query';
import Error from './Error';
import Loading from './Loading';
import FormLecture from './FormLecture';

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

function Curiculum({ courseId }) {
  const classes = useStyles();
  const queryKey = `sections-courseId-${courseId}`;
  const { data, status, error } = useQuery(
    queryKey,
    fetchSectionsByIdCourse(courseId)
  );

  const [openAddNewSection, setOpenAddNewSection] = useState(
    false
  );
  const [openAddNewLecture, setOpenAddNewLecture] = useState(
    false
  );
  const [idSectionSelected, setIdSectionSelected] = useState('');
  const handleToggleNewLecture = useCallback(
    (id) => () => {
      const isOpen =
        id === idSectionSelected && openAddNewLecture
          ? false
          : true;
      setOpenAddNewLecture(isOpen);
      setIdSectionSelected(id);
    },
    [idSectionSelected, openAddNewLecture]
  );

  if (status === 'loading') return <Loading />;

  return (
    <div className={classes.container}>
      <Error message={error} status={status} />
      <Grid container justify="space-between">
        <Grid item>
          <Typography className={classes.text1}>
            Curiculum
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" className={classes.button}>
            Submit Course
          </Button>
        </Grid>
      </Grid>
      {!data.length && (
        <Alert severity="info">Sections Empty!</Alert>
      )}
      {data.map((section, index) => (
        <div className={classes.containerSection} key={section.id}>
          <div className={classes.section}>
            <Grid container>
              <Grid item>
                <Typography variant="subtitle1">
                  Section {index + 1}: {section.title}
                </Typography>
              </Grid>
            </Grid>
          </div>
          {section.lectures.map((lecture, index) => (
            <div className={classes.lecture} key={lecture.id}>
              <Grid container>
                <Grid item>
                  <Typography variant="subtitle2">
                    Lecture {index + 1}: {lecture.title}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          ))}

          <div>
            {!openAddNewLecture ||
            idSectionSelected !== section.id ? (
              <Grid container style={{ paddingLeft: '2rem' }}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={handleToggleNewLecture(section.id)}
                    variant="outlined"
                    color="primary">
                    New Lecture
                  </Button>
                </Grid>
              </Grid>
            ) : null}
            {openAddNewLecture &&
              idSectionSelected === section.id && (
                <FormLecture
                  sectionId={section.id}
                  queryRefetchOnSucces={queryKey}
                  onCancel={handleToggleNewLecture(section.id)}
                />
              )}
          </div>
        </div>
      ))}
      <br />
      <br />
      {openAddNewSection && (
        <FormNewSection
          onCancel={() => setOpenAddNewSection(false)}
          queryRefetchOnSucces={queryKey}
          courseId={courseId}
        />
      )}
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="outlined"
          type="submit"
          className={classes.button3}
          disabled={openAddNewSection}
          onClick={() => setOpenAddNewSection(true)}>
          Add New Section
        </Button>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1.8rem',
    boxShadow: '0px 0px 4px rgba(5, 5, 5, 0.08)',
    borderRadius: '8px',
    marginBottom: '1.2rem',
  },
  containerSection: {
    marginBottom: '8px',
  },
  section: {
    borderRadius: '4px',
    padding: '1rem',
    cursor: 'pointer',
  },
  lecture: {
    borderRadius: '4px',
    padding: '1rem',
    cursor: 'pointer',
    marginLeft: '2rem',
    background: '#FFFFFF',
    border: '1px solid #F0F2F5',
    marginBottom: '8px',
  },
  button: {
    fontWeight: 'bolder',
    fontSize: '0.875rem',
    color: '#FFFFFF',
    textTransform: 'none',
    backgroundColor: theme.color.primary,
  },
  button2: {
    fontWeight: 'bolder',
    fontSize: '0.875rem',
    color: theme.color.primary,
    textTransform: 'none',
    border: `2px solid ${theme.color.primary}`,
  },
  button3: {
    fontWeight: 'bolder',
    fontSize: '0.875rem',
    color: theme.color.primary,
    textTransform: 'none',
  },
  text1: {
    fontWeight: 'bolder',
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
    color: '#050505',
    marginBottom: '2.25rem',
  },
  text2: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: '#050505',
    marginBottom: '0.9375rem',
  },
}));

export default Curiculum;
