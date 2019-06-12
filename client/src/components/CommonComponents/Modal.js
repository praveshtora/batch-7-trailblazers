import React, { Fragment } from "react";
import { Typography, Modal, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./../../App.css";
const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none"
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
      >
        <div
          style={{ width: props.width }}
          className={classes.paper + " modalStyle"}
        >
          <div style={{ display: "flex" }}>
            <Box
              bgcolor="primary.main"
              color="primary.contrastText"
              p={2}
              m={0}
              className="modalHeader"
            >
              <Typography variant="h6">{props.title}</Typography>
            </Box>
          </div>
          <div style={{ marginTop: "20px" }}>{props.children}</div>
        </div>
      </Modal>
    </Fragment>
  );
}
