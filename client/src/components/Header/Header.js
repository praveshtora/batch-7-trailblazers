import React, { Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
          <Typography variant="h6" color="inherit">
            {name}
          </Typography>
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
