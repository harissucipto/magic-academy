import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  TextField,
} from '@material-ui/core';
import Axios from 'axios';
import { useMutation, queryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import Loading from './Loading';
import Error from './Error';

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
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      await mutate(data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Create new course
      </Button>
      <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}>
        <DialogContent>
          <Typography variant="h6">Create New Course</Typography>
          {status === 'loading' && <Loading />}
          <Error message={error} status={status} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label htmlFor="title">Course Title</label>
                <br />
                <TextField
                  variant="filled"
                  id="title"
                  fullWidth
                  name="title"
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
                <label htmlFor="description">Description</label>
                <br />
                <TextField
                  variant="filled"
                  id="description"
                  fullWidth
                  rows="6"
                  multiline
                  name="description"
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
                <label htmlFor="cover">Cover</label>
                <br />
                <TextField
                  variant="filled"
                  id="cover"
                  fullWidth
                  type="file"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item>
                    <Button variant="outlined">Cancel</Button>
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained">
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

export default NewCourse;
