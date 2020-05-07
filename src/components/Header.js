import React from 'react';
import { useHistory } from 'react-router-dom';
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
} from '../contants/paths';
import { useStoreState, useStoreActions } from 'easy-peasy';
import User from './User';

function Header() {
  const classes = useStyles();
  const history = useHistory();
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
            src={Logo}
            alt="logo-header"
            onClick={() => {
              history.push(HOME);
            }}
          />
        </Grid>
        <Grid item xs={7} sm={4} md={3}>
          <TextField
            fullWidth
            variant="filled"
            placeholder="Search course here ..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
                  <Button color="primary" variant="contained">
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
}));

export default Header;
