import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './board.css';
import '../../App.css';
import axios from 'axios';
import DatePicker from '../DatePicker';
import { SERVER_URL } from '../../config';
import Modal from '../CommonComponents/Modal';
import { requestToServer } from '../../util/helper';
import { TextField, Grid, MenuItem } from '@material-ui/core';
import { useFormInput, useSnackBar } from '../../customHooks';

const AddIssueModal = props => {
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState({
    show: false,
    message: ''
  });
  const title = useFormInput('');
  const description = useFormInput('');
  const assignee = useFormInput('');
  const dueDate = useFormInput(null, true);
  const [boardMembers, setBoardMembers] = useState([]);
  const { openSnackBar } = useSnackBar();
  const { boardId } = props;

  const handleOnSubmit = event => {
    event.preventDefault();
    if (!title.value) {
      showError(true, 'please enter Title');
      return;
    }
    const addIssueData = {
      title: title.value,
      description: description.value,
      assignee: assignee.value
    };
    if (dueDate.value) {
      addIssueData.dueDate = dueDate.value;
    }
    addIssue(addIssueData);
  };

  function fetchBoardMembers() {
    requestToServer(
      axios(`${SERVER_URL}/board/members/${boardId}`, {
        withCredentials: true
      }),
      setBoardMembers,
      message => openSnackBar('error', message)
    );
  }

  useEffect(fetchBoardMembers, []);

  const addIssue = async data => {
    try {
      setIsSaving(true);
      const response = await axios({
        url: `${SERVER_URL}/board/issue/add/${boardId}`,
        method: 'post',
        withCredentials: true,
        data
      });
      const { isSuccess, message } = response.data;
      const messageType = isSuccess ? 'success' : 'error';
      openSnackBar(messageType, message);
      setIsSaving(false);
      props.afterSave();
      props.handleClose();
    } catch (error) {
      setIsSaving(false);
      if (error.response && error.response.data) {
        const message = error.response.data.message;
        openSnackBar('error', message);
      }
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
      width="450px"
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
              {boardMembers.map(member => (
                <MenuItem key={member.user._id} value={member.user.name}>
                  {member.user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={5}>
            <DatePicker
              disablePast
              label="Due Date"
              margin="normal"
              clearable={true}
              {...dueDate}
            />
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {validationError.show && (
                <label className="error-msg">{validationError.message}</label>
              )}
            </Grid>
          </Grid>
        </Grid>
        <div style={{ marginTop: '10px' }}>
          <div className="float-right">
            <Button loading={isSaving} color="secondary" type="submit">
              Save
            </Button>
          </div>
          <div className="float-right">
            <Button color="secondary" onClick={props.handleClose}>Close</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddIssueModal;
