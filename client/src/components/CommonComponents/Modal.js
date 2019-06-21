import React, { Fragment } from 'react';
import { Typography, Modal, Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Modal.css';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
    borderRadius: '5px'
  }
}));

export default function CustomModal(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={() => {
          props.handleClose();
        }}
        disableBackdropClick={true}
      >
        <div
          style={{ width: props.width }}
          className={classes.paper + ' modalStyle'}
        >
          <Box bgcolor="primary.main" color="primary.contrastText" p={2} m={0}>
            <Typography variant="h6" style={{ display: 'inline-block' }}>
              {props.title}
            </Typography>
            <div className="modalCloseCross">
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={props.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Box>
          <div style={{ padding: '32px' }}>{props.children}</div>
        </div>
      </Modal>
    </Fragment>
  );
}
