import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from '../../assets/grootlogo.png';
const useStyles = makeStyles(theme => ({
  rightAligned: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  spacing: {
    right: theme.spacing(2)
  }
}));

function Header({ name = '', children, ...rest }) {
  const classes = useStyles();

  return (
    <AppBar position="static" {...rest}>
      <Toolbar>
        <Typography variant="h6" color="inherit">
          {name}
        </Typography>
        <a href="/dashboard"><img width="150px" alt="Groot" src={logo} /></a>
        <div className={classes.rightAligned}>{children}</div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
