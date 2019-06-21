import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import { Box, Typography } from '@material-ui/core';
import Button from './../Button/Button';
import CloseButton from '../CloseButton';
import { SERVER_URL } from '../../config';
import Paper from '@material-ui/core/Paper';
import { useFormInput } from '../../customHooks';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedSelectInput from '../OutlinedSelectInput';
import EditableTextField from '../EditableTextField/EditableTextField';
import axios from 'axios';
import DatePicker from '../DatePicker';
import { useSnackBar } from '../../customHooks';
import { requestToServer } from '../../util/helper';
import LinearProgress from '@material-ui/core/LinearProgress';
import './IssueDetails.css';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.primary.main
  },
  newCommentInput: {
    color: theme.palette.primary.main,
    backgroundColor: '#ffffff',
    borderRadius: 4
  },
  commentsContainer: {
    backgroundColor: '#dce1ff'
  }
}));

const CommentsList = ({ data }) => {
  const comments = data.map((comment, index) => (
    <Paper className="comment-wrapper" key={`${comment.createdAt}${index}`}>
      <Box display="flex" justifyContent="space-between">
        <span className="comment-username">{comment.createdBy}</span>
        <span className="comment-time">
          {moment(comment.createdAt).fromNow()}
        </span>
      </Box>
      <Box className="comment-content">{comment.description}</Box>
    </Paper>
  ));

  return <div className="comments-wrapper">{comments}</div>;
};

const IssueDetails = ({ issueId, boardMembers, onClose, onUpdateIssue }) => {
  const classes = useStyles();

  const [id, setId] = useState(0);
  const title = useFormInput('Loading');
  const dueDate = useFormInput(undefined, true);
  const assignee = useFormInput('');
  const newComment = useFormInput('');
  const description = useFormInput('');
  const [comments, setComments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newComments, setNewComments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [createdBy, setCreatedBy] = useState('Unknown');

  const { openSnackBar } = useSnackBar();
  const showError = message => openSnackBar('error', message);

  const targetValue = val => ({ target: { value: val } });
  const getIssueDetails = () => {
    setDataLoading(true);
    requestToServer(
      axios.get(`${SERVER_URL}/issue/${issueId}`, {
        withCredentials: true
      }),
      data => {
        setId(data.id);
        setNewValue(title, data.title);
        dueDate.onChange(data.dueDate);
        setNewValue(assignee, data.assignee);
        setNewValue(description, data.description);
        setComments(data.comments.reverse());
        setDataLoading(false);
        setCreatedBy( data.createdBy && data.createdBy.name);
      },
      showError
    );
  };

  const setNewValue = (target, value) => target.onChange(targetValue(value));

  const handleOnNewComment = ev => {
    ev.preventDefault();

    const { name } = Cookies.getJSON('issue_tracker_user');
    const comment = {
      description: newComment.value,
      createdBy: name,
      createdAt: new Date()
    };

    setComments([comment, ...comments]);
    setNewComments([comment, ...newComments]);
    setNewValue(newComment, '');
  };

  useEffect(getIssueDetails, [issueId]);
  const handleUpdate = () => {
    setIsSaving(true);

    const fields = {
      title: title.value,
      assignee: assignee.value,
      description: description.value,
    };
    if (dueDate.value) {
      fields.dueDate = dueDate.value;
    }

    requestToServer(
      axios.post(
        `${SERVER_URL}/issue/update`,
        { id: issueId, ...fields, newComments },
        { withCredentials: true }
      ),
      (data, message) => {
        setIsSaving(false);
        onUpdateIssue(message);
      },
      errMessage => {
        showError(errMessage);
        setIsSaving(false);
      }
    );
  };

  return (
    <Paper className="IssueDetails">
      <header className={classes.header}>
        <div className="title-container">
          <div className="labeled">{id}</div>
          <EditableTextField className="title" {...title} />
        </div>
        <CloseButton onClose={onClose} />
      </header>
      {dataLoading && <LinearProgress />}
      <div className="container">
        <div>
          <Typography display='block' gutterBottom variant="overline">Created By: {createdBy}</Typography>
        </div>
        <div>
          <Box display="flex"  justifyContent="space-between">
            <DatePicker
             
              className="date-picker"
              disablePast
              label="Due Date"
              {...dueDate}
            />
            <OutlinedSelectInput
              label="Assignee"
              data={boardMembers}
              selected={assignee}
              className="assignee-selector"
              {...assignee}
            />
          </Box>
          <div>
            <TextField
              variant="outlined"
              label="Description"
              rows="2"
              margin="normal"
              fullWidth
              multiline
              {...description}
            />
          </div>
          <div>
            <Paper
              className={`${classes.commentsContainer} comments-container`}
              >
              <h3>Comments</h3>
              <form onSubmit={handleOnNewComment}>
                <TextField
                  color="primary"
                  variant="outlined"
                  placeholder="Write your comment..."
                  InputProps={{ className: classes.newCommentInput }}
                  margin="dense"
                  fullWidth
                  multiline
                  {...newComment}
                />
                {newComment.value && (
                  <Button type="submit" color="secondary">
                    Save
                  </Button>
                )}
              </form>
              <hr />
              <CommentsList data={comments} />
            </Paper>
          </div>
        </div>
      </div>
      <Box m={1} display="flex" flexDirection="row-reverse">
        <Button
          m={5}
          loading={isSaving}
          onClick={handleUpdate}
          color="secondary"
        >
          Update
        </Button>
      </Box>
    </Paper>
  );
};

export default IssueDetails;
