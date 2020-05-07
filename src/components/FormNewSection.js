import React from 'react';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useMutation, queryCache } from 'react-query';
import { useStoreState } from 'easy-peasy';
import Error from './Error';
import Loading from './Loading';

const postNewSection = (token) => async (inputan) => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      query: `
        mutation createSection($inputan: CreateSectionInput ) {
          createSection(
            input: $inputan
          ) {
            id
            title
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

const FormNewSection = ({
  onCancel,
  queryRefetchOnSucces,
  courseId,
}) => {
  const classes = useStyles();
  const { token } = useStoreState((state) => state.auth);
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { status, error }] = useMutation(
    postNewSection(token),
    {
      onSuccess: () => {
        queryCache.refetchQueries(queryRefetchOnSucces);
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      await mutate({ ...data, courseId });
      onCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Error error={error} status={status} />
        {status === 'loading' && <Loading />}

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <label htmlFor="titleSection">New Section</label>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="titleSection"
                  fullWidth
                  variant="filled"
                  placeholder="e.g. Learn Javascript from scracth"
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
              <Grid item xs={12} md={4}>
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item>
                    <Button
                      disabled={status === 'loading'}
                      variant="outlined"
                      className={classes.button2}
                      onClick={onCancel}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      disabled={status === 'loading'}
                      type="submit"
                      variant="contained"
                      className={classes.button}>
                      Add Section
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: '2.7rem',
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
    border: `2px solid ${theme.color.primary}`,
    textTransform: 'none',
  },
}));

export default FormNewSection;
