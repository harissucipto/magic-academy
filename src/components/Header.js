import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  Avatar,
  makeStyles,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Logo from '../img/logo-header.png';
import { HOME } from '../contants/paths';

function Header() {
  const classes = useStyles();
  const history = useHistory();

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
            onClick={() => history.push(HOME)}
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
            <Grid item>
              <Button>My Course</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">
                Switch to instructor View
              </Button>
            </Grid>
            <Grid item>
              <Avatar>I</Avatar>
            </Grid>
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
