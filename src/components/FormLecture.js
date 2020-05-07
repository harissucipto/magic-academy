import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useStoreState } from 'easy-peasy';
import { useMutation, queryCache } from 'react-query';

import Error from './Error';
import Loading from './Loading';

const postNewLecture = (token) => async (inputan) => {
  console.log(inputan);
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      query: `
        mutation createLecture($inputan: CreateLectureInput ) {
          createLecture(
            input: $inputan
          ) {
            id
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

function FormLecture({
  onCancel,
  queryRefetchOnSucces,
  sectionId,
}) {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { token } = useStoreState((state) => state.auth);
  const [mutate, { status, error }] = useMutation(
    postNewLecture(token),
    {
      onSuccess: () => {
        queryCache.refetchQueries(queryRefetchOnSucces);
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      await mutate({ ...data, sectionId });
      onCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        className={classes.formLecture}
        onSubmit={handleSubmit(onSubmit)}>
        <Error error={error} status={status} />
        {status === 'loading' && <Loading />}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={1}></Grid>
              <Grid item xs={7}>
                <label htmlFor="titleLecture">Lecture Title</label>
                <br />
                <TextField
                  id="titleLecture"
                  fullWidth
                  variant="filled"
                  placeholder="e.g. Learn Javascript from scracth"
                  name="title"
                  inputRef={register({ required: true })}
                  error={!!errors.title}
                />
                {errors.titleLecture && (
                  <Typography variant="subtitle2">
                    This field is required
                  </Typography>
                )}
              </Grid>
              <Grid item xs={4}>
                <label>Thumbnail</label>
                <br />
                <TextField
                  fullWidth
                  variant="filled"
                  placeholder="No file selected"
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <label htmlFor="embededLinkVideo">
                      Embeded Link Video
                    </label>
                    <br />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="url"
                      placeholder="insert embeded link video..."
                      id="embededLinkVideo"
                      name="embedLink"
                      inputRef={register({ required: true })}
                      error={!!errors.embedLink}
                    />
                    {errors.embededLinkVideo && (
                      <Typography variant="subtitle2">
                        This field is required
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}>
                      <label htmlFor="descriptionLecture">
                        Descriptions
                      </label>
                      <br />
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        variant="filled"
                        placeholder="Briefly describe this course..."
                        id="descriptionLecture"
                        name="description"
                        inputRef={register()}
                        error={!!errors.description}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container justify="flex-end" spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={status === 'loading'}
                  onClick={onCancel}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status === 'loading'}
                  color="primary">
                  Add Lecture
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  formLecture: {
    marginBottom: '4rem',
    marginTop: '3rem',
  },
}));

export default FormLecture;
