import React, { useState } from 'react';
import Header from '../Header';
import {
  Icon,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box
} from '@material-ui/core';
import { Auth } from '../PrivateRoute';
import './HeaderWithUserAvatar.css';
import Cookies from 'js-cookie';

const HeaderWithUserAvatar = ({ name = '', children, ...rest }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const openProfile = Boolean(profileAnchorEl);
  const [userName, setUserName] = useState('');

  const logOut = () => {
    console.log('logging out');
    Auth.logout();
    setProfileAnchorEl(null);
  };

  const handleProfileClick = function(event) {
    setProfileAnchorEl(event.currentTarget);
    if(Cookies.get('issue_tracker_user')) {
      const user = JSON.parse(Cookies.get('issue_tracker_user'));
      setUserName(user.name);
    } 
  }

  return (
    <Header
      name={name}
      {...rest}
    >
      <Box display="flex" alignItems="center">
        {children}
        <Icon
          style={{ fontSize: 30, float: 'right', cursor: 'pointer' }}
          onClick={handleProfileClick}
        >
          account_circle
        </Icon>
      </Box>
      <Popover
        open={openProfile}
        onClose={() => setProfileAnchorEl(null)}
        anchorEl={profileAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <List component="nav">
          <ListItem>
            <ListItemText primary={userName}/>
          </ListItem>
          <ListItem onClick={logOut} button>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
    </Header>
  );
};

export default HeaderWithUserAvatar;
