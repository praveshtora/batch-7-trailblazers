import React, { useState } from 'react';
import './App.css';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom';
import Login from './views/Login';
import Signup from './components/SignUp';
import SnackBarProvider from './context/SnackBarProvider';
import DashBoard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import BoardDetails from './components/Board/BoardDetails';
import MemberList from './components/Board/Settings/MembersList';
import PrivateRoute, { Auth } from './components/PrivateRoute/PrivateRoute';
import { Icon, Popover, List, ListItem, ListItemText } from '@material-ui/core';

function App() {

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [pathname, setPathName] = useState(null);
  const openProfile = Boolean(profileAnchorEl);

  const handleProfileClick = function(event) {
    setProfileAnchorEl(event.currentTarget);
  }

  const logOut = () => {
    Auth.logout();
    setProfileAnchorEl(null);
  }

  return (
    <SnackBarProvider>
      <Header name="IsTrack" >
        <Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} 
        onClick={handleProfileClick} button>account_circle
        </Icon>
      <Popover
          open={openProfile}
          onClose={()=> {
            setProfileAnchorEl(null);
          }}
          anchorEl = {profileAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List component="nav">
            <ListItem onClick={logOut} button>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
      </Popover>
      </Header>
    
      <div className="app-body">
        <Router>
          <Switch>
            <PrivateRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/dashboard" component={DashBoard} />
            <PrivateRoute
              exact
              path="/boarddetails/:id"
              component={BoardDetails}
            />
            <PrivateRoute
              exact
              path="/boarddetails/setting/:id"
              component={MemberList}
            />
            <Redirect exact from="/" to="/login" />
            <Redirect from="/" to="/login" />
          </Switch>
        </Router>
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    </SnackBarProvider>
  );
}

export default App;
