import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 20,
    opacity: 0.9
  }
}));

const CloseButton = ({ onClose, className = '' }) => {
  const { icon } = useStyles();
  return (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={onClose}
    >
      <CloseIcon className={`${icon} ${className}`} />
    </IconButton>
  );
};

export default CloseButton;
