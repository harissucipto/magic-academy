import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { useMutation, queryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import Loading from './Loading';
import { Alert } from '@material-ui/lab';

const postNewCourse = (token) => async (inputan) => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      query: `
        mutation createCourse($inputan: CreateCourseInput ) {
          createCourse(
            input: $inputan
          ) {
            id
            title
            cover
          }
        }
      `,
      variables: {
        inputan: inputan,
      },
    },
  });

  return resp.data;
};

function NewCourse() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const { token } = useStoreState((state) => state.auth);
  const [mutate, { status, error }] = useMutation(
    postNewCourse(token),
    {
      onSuccess: () => {
        queryCache.refetchQueries('coursesCreatedBy');
      },
    }
  );
  const [errorExtra, setErrorExtra] = useState('');
  const { register, handleSubmit, errors } = useForm();

  console.log(error);

  const onSubmit = async (inputan) => {
    try {
      const { errors } = await mutate(inputan);
      // handleClose();
      if (errors?.length) {
        setErrorExtra(
          errors.map(({ message }) => message).join(',')
        );
      }
      handleClose();
    } catch (error) {
      setErrorExtra('Internal Server Error');
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        className={classes.button}>
        Create new course
      </Button>
      <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}>
        <DialogContent className={classes.container}>
          <Typography className={classes.text1}>
            Create New Course
          </Typography>
          {status === 'loading' && <Loading />}
          {error || errorExtra ? (
            <>
              <br />
              <Alert severity="error">
                {error?.message ?? ''} {errorExtra}
              </Alert>
              <br />
            </>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label htmlFor="title" className={classes.text2}>
                  Course Title
                </label>
                <br />
                <TextField
                  variant="filled"
                  id="title"
                  fullWidth
                  name="title"
                  placeholder="e.g. Learn Javascript from Scratch"
                  inputRef={register({ required: true })}
                  error={!!errors.title}
                />
                {errors.title && (
                  <Typography variant="subtitle2">
                    This field is required
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <label
                  htmlFor="description"
                  className={classes.text2}>
                  Description
                </label>
                <br />
                <TextField
                  variant="filled"
                  id="description"
                  fullWidth
                  rows="6"
                  multiline
                  name="description"
                  placeholder="Briefly describe this course"
                  inputRef={register()}
                  error={!!errors.description}
                />
                {errors.description && (
                  <Typography variant="subtitle2">
                    This field is required
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="cover" className={classes.text2}>
                  Cover
                </label>
                <br />
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    className={classes.button}>
                    Upload
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      className={classes.button2}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      className={classes.button}>
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
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
  container: {
    padding: '1.75rem',
  },
  text1: {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    color: '#050505',
    marginBottom: '1.75rem',
  },
  text2: {
    fontWeight: 'bold',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: '#050505',
    marginBottom: '0.5rem',
  },
  text3: {
    fontWeight: 'bold',
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
    color: '#8A8C90',
  },
  text4: {
    fontSize: '0.75rem',
    lineHeight: '1.5rem',
    color: '#8A8C90',
  },
}));

export default NewCourse;
