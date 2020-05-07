import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Logo from '../img/logo-header.png';
import {
  HOME,
  LOGIN,
  MY_COURSE,
  INSTRUCTOR,
  ENROLL,
  REGISTER,
} from '../contants/paths';
import { useStoreState, useStoreActions } from 'easy-peasy';
import User from './User';

function Header() {
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = useLocation();
  const { isLoggedIn } = useStoreState((state) => state.auth);
  const { view } = useStoreState((state) => state.ui);
  const { changeView } = useStoreActions((actions) => actions.ui);

  return (
    <div>
      <Grid container className={classes.container} spacing={3}>
        <Grid
          item
          xs={4}
          sm={1}
          md={1}
          className={classes.imgContainer}>
          <img
            style={{ cursor: 'pointer' }}
            src={Logo}
            alt="logo-header"
            onClick={() => {
              history.push(HOME);
            }}
          />
        </Grid>
        <Grid item xs={7} sm={4} md={3}>
          {!pathname.includes(ENROLL) && (
            <TextField
              fullWidth
              variant="filled"
              placeholder="Search course here ..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Grid
            container
            spacing={2}
            justify="flex-end"
            alignContent="center"
            className={classes.rightContainer}>
            {isLoggedIn && (
              <>
                <Grid item>
                  <Button
                    className={classes.buttonMyCourse}
                    onClick={() => {
                      if (view === 'student') {
                        history.push(MY_COURSE);
                        return;
                      }
                      history.push(INSTRUCTOR);
                    }}>
                    My Course
                  </Button>
                </Grid>
                {view === 'student' ? (
                  <>
                    <Grid item>
                      <Button
                        variant="outlined"
                        className={classes.buttonSwitch}
                        onClick={() => {
                          changeView('instructor');
                          history.push(INSTRUCTOR);
                        }}>
                        Switch to instructor View
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <Grid item>
                    <Button
                      variant="outlined"
                      className={classes.buttonSwitch}
                      onClick={() => {
                        changeView('student');
                        history.push(HOME);
                      }}>
                      Switch to student View
                    </Button>
                  </Grid>
                )}

                <Grid item>
                  <User />
                </Grid>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Grid item>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => history.push(LOGIN)}>
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => history.push(REGISTER)}>
                    Register
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.container.primary,
    margin: '0 auto',
  },
  imgContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    height: 'inherit',
  },
  buttonMyCourse: {
    textTransform: 'none',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '0.87rem',
  },
  buttonSwitch: {
    textTransform: 'none',
    color: theme.color.primary,
    fontWeight: 'bold',
    fontSize: '0.87rem',
    border: `2px solid ${theme.color.primary}`,
  },
}));

export default Header;
