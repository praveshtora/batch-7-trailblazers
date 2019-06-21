import React from 'react';
import './App.css';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Login from './views/Login';
import Signup from './components/SignUp';
import SnackBarProvider from './context/SnackBarProvider';
import DashBoard from './components/Dashboard';
import BoardDetails from './components/Board/BoardDetails';
import MemberList from './components/Board/Settings/MembersList';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import HeaderWithUserAvatar from './components/HeaderWithUserAvatar';

function App(props) {
  const isLoginView = props.location.pathname === '/login';
  return (
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <div className="App">
          {isLoginView || <HeaderWithUserAvatar />}
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
            <Redirect from="/" to="/login" />
          </Switch>
        </div>
      </SnackBarProvider>
    </ThemeProvider>
  );
}

export default withRouter(App);
