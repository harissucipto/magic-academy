import React, { useState } from 'react';
import { Avatar, Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ExitToApp } from '@material-ui/icons';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { HOME } from '../contants/paths';

const User = () => {
  const [anchorEl, setAncorEl] = useState(null);
  const handleClick = (evt) => setAncorEl(evt.currentTarget);
  const handleClose = () => setAncorEl(null);

  const { firstName } = useStoreState((state) => state.auth.user);
  const titleAvatar =
    firstName
      ?.split(' ')
      .map((item) => item.slice(0, 1))
      .join('')
      .toUpperCase() || 'U';

  const history = useHistory();
  const { signout } = useStoreActions((actions) => actions.auth);
  const handleLogout = () => {
    signout();
    history.push(HOME);
  };

  return (
    <>
      <Avatar
        onClick={handleClick}
        style={{
          backgroundColor: 'maroon',
          cursor: 'pointer',
        }}>
        {titleAvatar}
      </Avatar>
      <Menu
        style={{ marginTop: '55px' }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={handleClose}>
        <MenuItem onClick={handleLogout}>
          <ExitToApp color="primary" />
          <span style={styles.titleIcon}>Logout</span>
        </MenuItem>
      </Menu>
    </>
  );
};

const styles = {
  titleIcon: {
    fontWeight: 'bold',
    paddingLeft: '10px',
  },
};

export default User;
