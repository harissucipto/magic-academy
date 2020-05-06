import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import {
  Typography,
  TextField,
  Checkbox,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';

import Logo from '../img/logo.png';
import { useHistory } from 'react-router-dom';
import { HOME } from '../contants/paths';
import Loading from '../components/Loading';

const signinRequest = async (inputan) => {
  const resp = await Axios.request({
    baseURL:
      'https://mejikacademy1588499516927.microgen.mejik.id/graphql',
    method: 'post',
    data: {
      query: `
        mutation login($input: LoginInput!) {
          login(
           input: $input
          ) {
           token
          }
        }
      `,
      variables: {
        input: {
          email: inputan.email,
          password: inputan.password,
        },
      },
    },
  });

  return resp.data;
};

function Login() {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { status, error }] = useMutation(signinRequest);
  const [errorExtra, setErrorExtra] = useState('');
  const history = useHistory();

  const onSubmit = async (inputan) => {
    setErrorExtra('');
    try {
      const { data, errors } = await mutate(inputan);
      if (errors?.length) {
        setErrorExtra(
          errors.map(({ message }) => message).join(',')
        );
        return;
      }
      history.push(HOME, data);
    } catch (error) {
      setErrorExtra('Internal Server Error');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.header}>
          <img src={Logo} alt="logo" />
          <Typography variant="h4">Login</Typography>
          <br />
          <Typography variant="h6">
            Login and start managing your learning <br /> porcess!
          </Typography>
        </div>

        {error || errorExtra ? (
          <>
            <br />
            <Alert severity="error">
              {error?.message ?? ''} {errorExtra}
            </Alert>
            <br />
          </>
        ) : null}

        {status === 'loading' && <Loading />}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label htmlFor="email">Email</label>
              <br />
              <TextField
                type="email"
                id="email"
                fullWidth
                variant="filled"
                name="email"
                placeholder="najib@gmail.com"
                error={!!errors.email}
                inputRef={register({ required: true })}
              />
              {errors.email && (
                <Typography variant="subtitle2">
                  This field is required
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="password">Passwords</label>
              <br />
              <TextField
                id="password"
                type="password"
                fullWidth
                variant="filled"
                name="password"
                placeholder="Input your password"
                error={!!errors.password}
                inputRef={register({ required: true })}
              />
              {errors.password && (
                <Typography variant="subtitle2">
                  This field is required
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <Checkbox
                    id="keepMe"
                    name="keepMe"
                    className={classes.orangeText}
                    inputRef={register}
                  />
                  <label htmlFor="keepMe">Keep me signed in</label>
                </Grid>
                <Grid
                  item
                  xs={6}
                  className={classes.forgettenPassword}>
                  <Typography>Forgotten your password?</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={status === 'loading'}
                type="submit"
                variant="contained"
                fullWidth
                className={classes.button}>
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                align="center"
                className={classes.orangeText}>
                Don't you have an account yet? Register here
              </Typography>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  textField: {
    border: 'none',
  },
  container: {
    backgroundColor: theme.color.primary,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    maxWidth: '36rem',
    color: 'white',
    padding: '10px 10px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1rem',
    '& img': {
      marginBottom: '3rem',
    },
  },
  checkbox: {
    display: 'flex',
  },
  forgettenPassword: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: theme.color.orange,
  },
  orangeText: {
    color: theme.color.orange,
  },
  button: {
    textTransform: 'none',
    backgroundColor: theme.color.orange,
    height: '3.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bolder',
  },
}));

export default Login;
