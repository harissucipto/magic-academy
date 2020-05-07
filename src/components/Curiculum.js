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
  const { data, status, error } = useQuery(
    `sections-courseId-${courseId}`,
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
      {JSON.stringify(error)} {status}
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h6">Curiculum</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Submit Course
          </Button>
        </Grid>
      </Grid>
      <br />
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

          <div className={classes.lecture}>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  onClick={handleToggleNewLecture(section.id)}
                  variant="contained"
                  color="primary">
                  New Lecture
                </Button>
              </Grid>
            </Grid>
          </div>

          {openAddNewLecture &&
            idSectionSelected === section.id && <FormLecture />}
        </div>
      ))}
      <br />
      <br />
      {openAddNewSection && (
        <FormNewSection
          onCancel={() => setOpenAddNewSection(false)}
          queryRefetchOnSucces={`sections-courseId-${courseId}`}
          courseId={courseId}
        />
      )}
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          type="submit"
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
}));

export default Curiculum;
