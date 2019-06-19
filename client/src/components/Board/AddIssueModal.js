import React, { useState, useEffect } from 'react';
import Modal from './../CommonComponents/Modal';
import { TextField, Grid, MenuItem } from '@material-ui/core';
import Button from './../Button/Button';
import './board.css';
import './../../App.css';
import { useFormInput } from './../../customHooks';
import axios from 'axios';
import { useSnackBar } from './../../customHooks';
import { SERVER_URL } from './../../config';

const AddIssueModal = props => {
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState({
    show: false,
    message: ''
  });
  const title = useFormInput('');
  const description = useFormInput('');
  const assignee = useFormInput('');
  const [dueDate, setDueDate] = useState('');
  const [boardMembers, setBoardMembers] = useState([]);
  const { openSnackBar } = useSnackBar();
  useEffect(() => {
    fetchBoardMembers();
  }, [props]);
  const boardId = props.boardId;

  const handleOnSubmit = event => {
    event.preventDefault();
    if (!title.value) {
      showError(true, 'please enter Title');
      return;
    }
    addIssue({
      title: title.value,
      description: description.value,
      assignee: assignee.value,
      dueDate: dueDate
    });
  };

  async function fetchBoardMembers() {
    try {
      const result = await axios(`${SERVER_URL}/board/members/${boardId}`, {
        withCredentials: true,
      });
      setBoardMembers(result.data.data);
    }
    catch(error){
      if(error.response) {
      const { message } = error.response.data;
        openSnackBar('error', message);
      }
    }
  }

  const addIssue = async (data) => {
    try {
      setIsSaving(true);
      const response = await axios({
        url: `${SERVER_URL}/board/issue/add/${boardId}`,
        method: "post",
        withCredentials: true,
        data
      });
      const {isSuccess, message} = response.data;
      const messageType = isSuccess ? 'success' : 'error';
      openSnackBar(messageType, message);
      setIsSaving(false);
      props.afterSave();
      props.handleClose();
    } catch(error) {
      setIsSaving(false);
      if(error.response && error.response.data) {
        const message = error.response.data.message;
        openSnackBar('error', message);
      }
    }
  }
  const isVailidDate = event => {
    const date = event.target.value;
    const isValid = new Date(date) >= new Date();
    if (isValid) {
      setDueDate(date);
    } else {
      showError(true, 'Due date should be greater than todays date');
    }
  };

  const showError = (show, message = '') => {
    setValidationError({
      show,
      message
    });
    if (show) {
      setTimeout(() => {
        setValidationError({
          show: false,
          message: ''
        });
      }, 3000);
    }
  };

  return (
    <Modal
      open={props.open}
      title="Add Issue"
      handleClose={props.handleClose}
      width="500px"
    >
      <form onSubmit={handleOnSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              id="title"
              label="Title"
              margin="normal"
              fullWidth
              autoFocus={true}
              required
              {...title}
              inputProps={{ maxLength: '100' }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="description"
              label="Description"
              margin="normal"
              multiline
              rowsMax="8"
              fullWidth
              {...description}
              inputProps={{ maxLength: '500' }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={7}>
            <TextField
              id="assignedTo"
              select
              label="Assign To"
              margin="normal"
              fullWidth
              {...assignee}
              variant="outlined"
            >
              {
                boardMembers.map( (member, index) => {
                  return <MenuItem key={index} value={member.user._id}>
                          {member.user.name}
                        </MenuItem>
                })
              }
            </TextField>
          </Grid>
          <Grid item xs={5}>
            <TextField
              id="duedate"
              label="Due date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              onChange={isVailidDate}
            />
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {validationError.show && (
                <label className="eror-msg">{validationError.message}</label>
              )}
            </Grid>
          </Grid>
        </Grid>
        <div style={{ marginTop: '10px' }}>
          <div className="float-right">
            <Button loading={isSaving} type="submit">Save</Button>
          </div>
          <div className="float-right">
            <Button onClick={props.handleClose}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddIssueModal;
