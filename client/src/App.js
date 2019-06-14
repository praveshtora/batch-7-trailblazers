import React from 'react';
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

function App() {
  return (
    <SnackBarProvider>
      <Header name="IsTrack" />
      <div className="app-body">
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/dashboard" component={DashBoard} />
            <Route exact path="/boarddetails/:id" component={BoardDetails} />
            <Route exact path="/boarddetails/setting/:id" component={MemberList} />
            <Redirect exact from="/" to="/login" />
          </Switch>
        </Router>
      </div>
    </SnackBarProvider>
  );
}

export default App;
