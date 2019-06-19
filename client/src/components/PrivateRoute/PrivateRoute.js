import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export const Auth = {
  isAuthenticated: () => {
    return Boolean(Cookies.get('issue_tracker_user'));
  },

  logout() {
    Cookies.remove('issue_tracker_user');
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        const path = props.location.pathname;
        if ((path === '/login' || path === '/signup')) {
            
          if(Auth.isAuthenticated()) {return <Redirect
            to={{
              pathname: '/dashboard',
              state: { from: props.location }
            }}
          />
          }
          return <Component {...props} />;
          
        }

        return Auth.isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
        }
      }
    />
  );
}

// Intercept each axios request
axios.interceptors.response.use(res => res, function (error) {
  if(!error.response){
    error.response = { data: { isSuccess: false, message: 'Network Error!'} };
  } else if(error.response.status === 403) {
    Auth.logout();
    alert('Session Expired, Redirecting to login...');
    window.location.href = '/login'; 
  }
  return Promise.reject(error);
});

export default PrivateRoute;
