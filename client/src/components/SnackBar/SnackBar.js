import React from 'react';
import Slide from '@material-ui/core/Slide';
import MDSnackbar from '@material-ui/core/Snackbar';
import SnackBarContentWrapper from './SnackBarContentWrapper';

const TransitionUp = props => <Slide {...props} direction="up" />;

const SnackBar = ({
  message,
  type,
  open,
  handleClose = () => {
    open = false;
  }
}) => {
  return (
    <MDSnackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      TransitionComponent={TransitionUp}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <SnackBarContentWrapper
        onClose={handleClose}
        variant={type}
        message={message}
      />
    </MDSnackbar>
  );
};

export default SnackBar;
