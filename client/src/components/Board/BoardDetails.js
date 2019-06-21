import React, {Fragment, useState, useCallback, useRef, useEffect} from 'react';
import { Icon, Popover, List, ListItem, ListItemText, Box,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,TextField } from '@material-ui/core';
import AppMenu from '../AppMenu/AppMenu';
import KanbanView from '../KanbanView';
import Button from './../Button';
import AddIssueModal from './AddIssueModal';
import axios from 'axios';
import {SERVER_URL} from '../../config';
import { useSnackBar } from '../../customHooks';
import Modal from './../CommonComponents/Modal';
import constants from './../../constants';

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
  const [ userRole, setUserRole ] = useState('USER');
  const [ boardName, setBoardName ] = useState('Loading...');
  const { USER } = constants.ROLES;

  useEffect(()=> {
    fetchRole();
  }, [props])
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
        withCredentials: true,
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

  async function fetchRole() {
    try {
      const result = await axios(`${SERVER_URL}/board/member/role/${boardId}`,
      {
        withCredentials: true
      });
      if(result.data.data.length > 0) {
        setUserRole(result.data.data[0].role);
      }
    }
    catch(error){
      const { isSuccess, message } = error.response.data;
      if (!isSuccess) {
        openSnackBar('error', message);
      }
    }
  }

  const kanbanReference = useRef();

  return (
    <Fragment>
    <AppMenu title={boardName}>
    <div style={{float: 'right'}}>
      <Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} onClick={handleSettingClick}>settings</Icon>
      <div className="app-menu-button" ><Button onClick={()=>setOpenIssueModal(true)} ><Icon>add</Icon>New Issue</Button></div>
      { userRole === USER || <div className="app-menu-button" ><Button onClick={handleClickOpenInviteDailog}><Icon>add</Icon>Invite</Button></div>}
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

    <Modal title="Invite" open={openInviteUserDailog} handleClose={handleCloseInviteDailog} width="450px">
          Please enter the email address below to invite someone for collaboration
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          onChange = {setEmail}
        />
        <div style={{ marginTop: '10px' }}>
          <div className="float-right">
            <Button onClick={handleSaveInvite} color="primary">
              Invite
             </Button>
          </div>
          <div className="float-right">
          <Button onClick={handleCloseInviteDailog} >
            Cancel
          </Button>
          </div>
        </div>
    </Modal>
    <Box m={1}>
      <KanbanView ref={kanbanReference} boardId={props.match.params.id}  setBoardName={setBoardName}/>
    </Box>

    {openAddIssueModal && <AddIssueModal boardId={boardId} open={openAddIssueModal} handleClose={() => setOpenIssueModal(false)}
      afterSave={afterIssueAdded}/>}
    </Fragment>
  );
};

export default BoardDetails;
