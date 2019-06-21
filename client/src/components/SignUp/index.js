import React,{useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from 'axios';
import {SERVER_URL} from "../../config";
import {Redirect} from 'react-router';
import { useSnackBar } from '../../customHooks';


const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  errorMessage : {
    "text-align" : "center",
    color : "red",
  }
}));

export default function SignUp() {
  const classes = useStyles();

  const [user,setUser] = useState ({name :"", email:"",password: ""});
  const [errorMessage, setErrorMessage] = useState('');
  const [signUpSuccess, setSignUpSucess] = useState(false);
  const { openSnackBar } = useSnackBar();
  const [isSaving ,setIsSaving] = useState (false);

  const handleEmailChange = evt => {
    setUser({...user,email :evt.target.value});
  };

  const handlePasswordChange = evt => {
    setUser({...user, password:evt.target.value});
  };

  const handleNameChange = evt => {
    setUser({...user, name : evt.target.value});
  };

  const postData = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios({
        method : 'post',
        url : `${SERVER_URL}/signup`,
        data : {...user},
        headers: { "Content-Type": "application/json" },
      });
      if(response && response.data && response.data.isSuccess) {
        setErrorMessage('');
        setSignUpSucess(true);
        openSnackBar('success', response.data.message);
      }

    } catch (err) {
      if(err.response) {
        openSnackBar('error',err.response.data.message);
      }
    }
    setIsSaving(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={postData}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Name"
                autoFocus
                onChange ={handleNameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange ={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              {errorMessage ? <p className= {classes.errorMessage}>{errorMessage}</p> : ''}
            </Grid>
          </Grid>
          {!isSaving && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button> }
        
          {isSaving && <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled
          >
            <CircularProgress size={24} />
          </Button> }
        
          {signUpSuccess && <Redirect to="/login"></Redirect>}
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  
  );
}
