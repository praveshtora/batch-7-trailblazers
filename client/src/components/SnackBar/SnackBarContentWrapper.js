import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { makeStyles } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20,
    opacity: 0.9
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const CloseAction = ({ onClose }) => {
  const { icon } = useStyles();
  return (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={onClose}
    >
      <CloseIcon className={icon} />
    </IconButton>
  );
};

const SnackBarContentWrapper = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { message, onClose, variant, ...other } = props;

  const Icon =
    variant in variantIcon ? variantIcon[variant] : variantIcon['info'];

  return (
    <SnackbarContent
      className={classes[variant]}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classes.icon} /> &nbsp;
          {message}
        </span>
      }
      ref={ref}
      action={<CloseAction onClose={onClose} />}
      {...other}
    />
  );
});

export default SnackBarContentWrapper;
