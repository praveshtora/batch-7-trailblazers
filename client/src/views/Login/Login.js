import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { useFormInput, useSnackBar } from '../../customHooks';
import { SERVER_URL } from '../../config';

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
  const { openSnackBar, closeSnackBar } = useSnackBar();

  const email = useFormInput('');
  const password = useFormInput('');

  const showError = message => openSnackBar('error', message);
  const handleFormSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios({
        method: 'post',
        url: `/login`,
        data: { email: email.value, password: password.value },
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response || !response.data) {
        throw new Error('No response from server');
      }
      if (!response.data.isSuccess) throw new Error(response.data.message);
      props.history.push('/dashboard');
    } catch (err) {
      showError(err.message);
    }
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
            className={classes.submit}
          >
            Log In
          </Button>

          <Box textAlign="left">
            <span>Or</span>
            <Link href="/signup" variant="body2" className={classes.signUp}>
              {'Sign Up'}
            </Link>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default Login;
