import React, {Fragment, useState, useCallback, useRef} from 'react';
import { Icon, Popover, List, ListItem, ListItemText, Box,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField } from '@material-ui/core';
import AppMenu from '../AppMenu/AppMenu';
import KanbanView from '../KanbanView';
import Button from './../Button';
import AddIssueModal from './AddIssueModal';
import axios from 'axios';
import {SERVER_URL} from '../../config';
import { useSnackBar } from '../../customHooks';

const BoardDetails = props => {
  const boardId = props.match.params.id;
  const [settingAnchorEl, setsettingAnchorEl] = useState(null);
  const openSetting = Boolean(settingAnchorEl);
  const [openAddIssueModal, setOpenIssueModal] = useState(false);
  const [openInviteUserDailog, setOpenInviteUserDailog] = useState(false);
  const [inviteeEmail,setInviteeEmail] = useState('');
  const { openSnackBar } = useSnackBar();
  const showError = useCallback(message => openSnackBar('error', message), [openSnackBar]);
  const showSuccess = useCallback(message => openSnackBar('success', message), [openSnackBar]);


  const handleSettingClick = function(event) {
    setsettingAnchorEl(event.currentTarget);
  }

  const goToMembers = () => {
    props.history.push(`setting/${boardId}`);
  }

  const afterIssueAdded = () => {
    kanbanReference.current.refreshBoard();
  }

  const handleClickOpenInviteDailog = () => {
    setOpenInviteUserDailog(true);
  }

  const handleCloseInviteDailog = () => {
    setOpenInviteUserDailog(false);
  }

  const handleSaveInvite = async() => {
    try {
      const response = await axios({
        method : 'post',
        url : `${SERVER_URL}/board/${boardId}/invite`,
        data : {email : inviteeEmail},
        headers: { "Content-Type": "application/json" },
      });
      if(response && response.data && response.data.isSuccess) {
        handleCloseInviteDailog();
        showSuccess(`Sent invitation`)
      }
  
    } catch (err) {
      if (err.response && err.response.data) {
      showError(err.response.data.message);
      } else {
        showError ('Something went wrong');
      }
    }
  }

  const setEmail = (e) => {
    setInviteeEmail(e.target.value)
  }

  const kanbanReference = useRef();

  return (
    <Fragment>
    <AppMenu title="Board Details">
    <div style={{float: 'right'}}>
      <Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} onClick={handleSettingClick}>settings</Icon>
      <div className="app-menu-button" ><Button onClick={()=>setOpenIssueModal(true)} ><Icon>add</Icon>New Issue</Button></div>
      <div className="app-menu-button" ><Button onClick={handleClickOpenInviteDailog}><Icon>add</Icon>Invite</Button></div>
    </div>


    <Popover
        open={openSetting}
        onClose={()=> {
          setsettingAnchorEl(null);
        }}
        anchorEl = {settingAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List component="nav" aria-label="Mailbox folders">
          <ListItem onClick={goToMembers} button>
            <ListItemText primary="Members" />
          </ListItem>
        </List>
      </Popover>
    </AppMenu>
    <Dialog open={openInviteUserDailog} onClose={handleCloseInviteDailog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Invite</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address below to invite someone for collaboration
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange = {setEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDailog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveInvite} color="primary">
            Invite
          </Button>
        </DialogActions>
      </Dialog>

    <Box m={1}>
      <KanbanView ref={kanbanReference} boardId={props.match.params.id} />
    </Box>

    <AddIssueModal boardId={boardId} open={openAddIssueModal} handleClose={() => setOpenIssueModal(false)}
      afterSave={afterIssueAdded}/>
    </Fragment>
  );
};

export default BoardDetails;
