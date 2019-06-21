import React, { Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from './../../assets/grootlogo.png';
const useStyles = makeStyles(theme => ({
  rightAligned: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  spacing: {
    right: theme.spacing(2)
  },
  marginBottom: {
    marginBottom: '20px'
  }
}));

function Header({ name = '', children }) {
  const classes = useStyles();

  return (
    <div>
      <AppBar
        position="static"
        className={classes.marginBottom}
      >
        <Toolbar>
          <img width="150px" src={logo}/>
         
          <div className={classes.rightAligned}>
            {React.Children.map(children, child => {
              return React.cloneElement(child, { className: classes.spacing });
            })}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
