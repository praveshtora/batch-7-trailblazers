import axios from 'axios';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { SERVER_URL } from '../../config';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { requestToServer } from '../../util/helper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useFormInput, useSnackBar } from '../../customHooks';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  signUp: {
    margin: theme.spacing(1)
  }
}));

const FullLengthOutlinedTextField = props => (
  <TextField variant="outlined" margin="normal" required fullWidth {...props} />
);

const Login = props => {
  const classes = useStyles();
  const { openSnackBar } = useSnackBar();

  const email = useFormInput('');
  const password = useFormInput('');
  const [isLogin, setIsLogin] = useState(false);
  const showError = message => { 
    setIsLogin(false);
    openSnackBar('error', message);
  }
  const handleFormSubmit = e => {
    e.preventDefault();
    setIsLogin(true);
    requestToServer(
      axios({
        method: 'post',
        url: `${SERVER_URL}/login`,
        data: { email: email.value, password: password.value },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }),
      data => {
        Cookies.set('issue_tracker_user', data);
        props.history.push('/dashboard');
        setIsLogin(false);
      },
      showError
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
          <FullLengthOutlinedTextField
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...email}
          />
          <FullLengthOutlinedTextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...password}
          />
          {!isLogin && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button> }

          {isLogin && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled
          >
            <CircularProgress size={24} />
          </Button> }

          <Box textAlign="left">
            <span>Or</span>
            <Link href="/signup" className={classes.signUp}>
              {'Sign Up'}
            </Link>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default Login;
