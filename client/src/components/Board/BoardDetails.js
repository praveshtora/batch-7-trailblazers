import axios from 'axios';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import Button from './../Button';
import KanbanView from '../KanbanView';
import { SERVER_URL } from '../../config';
import AddIssueModal from './AddIssueModal';
import { useSnackBar } from '../../customHooks';
import Modal from './../CommonComponents/Modal';
import constants from './../../constants';
import { useFormInput } from '../../customHooks';
import AppMenu from '../AppMenu/AppMenu';
import {
  Icon,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField
} from '@material-ui/core';

const BoardDetails = props => {
  const boardId = props.match.params.id;
  const [settingAnchorEl, setSettingAnchorEl] = useState(null);
  const openSetting = Boolean(settingAnchorEl);
  const [openAddIssueModal, setOpenIssueModal] = useState(false);
  const [openInviteUserDialog, setOpenInviteUserDialog] = useState(false);
  const inviteeEmail = useFormInput('');
  const { openSnackBar } = useSnackBar();
  const [userRole, setUserRole] = useState('USER');
  const [boardName, setBoardName] = useState('Loading...');
  const { USER } = constants.ROLES;

  const showError = message => openSnackBar('error', message);
  const showSuccess = message => openSnackBar('success', message);
  const handleSettingClick = event => setSettingAnchorEl(event.currentTarget);
  const goToMembers = () => props.history.push(`setting/${boardId}`);
  const afterIssueAdded = () => kanbanReference.current.refreshBoard();
  const handleClickOpenInviteDialog = () => setOpenInviteUserDialog(true);
  const handleCloseInviteDialog = () => setOpenInviteUserDialog(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await axios(
          `${SERVER_URL}/board/member/role/${boardId}`,
          {
            withCredentials: true
          }
        );
        if (result.data.data.length > 0) {
          setUserRole(result.data.data[0].role);
        }
      } catch (error) {
        const { isSuccess, message } = error.response.data;
        if (!isSuccess) {
          openSnackBar('error', message);
        }
      }
    })();
  }, [boardId, openSnackBar]);

  const handleSaveInvite = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${SERVER_URL}/board/${boardId}/invite`,
        data: { email: inviteeEmail.value },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (response && response.data && response.data.isSuccess) {
        handleCloseInviteDialog();
        showSuccess(`Sent invitation`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message);
      } else {
        showError('Something went wrong');
      }
    }
  };

  const kanbanReference = useRef();

  return (
    <Fragment>
      <AppMenu title={boardName}>
        <div style={{ float: 'right' }}>
          <Icon
            style={{ fontSize: 30, float: 'right', cursor: 'pointer' }}
            onClick={handleSettingClick}
          >
            settings
          </Icon>
          <div className="app-menu-button">
            <Button onClick={() => setOpenIssueModal(true)}>
              <Icon>add</Icon>New Issue
            </Button>
          </div>
          {userRole === USER || (
            <div className="app-menu-button">
              <Button onClick={handleClickOpenInviteDialog}>
                <Icon>add</Icon>Invite
              </Button>
            </div>
          )}
        </div>

        <Popover
          open={openSetting}
          onClose={() => {
            setSettingAnchorEl(null);
          }}
          anchorEl={settingAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <List component="nav" aria-label="Mailbox folders">
            <ListItem onClick={goToMembers} button>
              <ListItemText primary="Members" />
            </ListItem>
          </List>
        </Popover>
      </AppMenu>
      <Popover
        open={openSetting}
        onClose={() => setSettingAnchorEl(null)}
        anchorEl={settingAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <List component="nav" aria-label="Mailbox folders">
          <ListItem onClick={goToMembers} button>
            <ListItemText primary="Members" />
          </ListItem>
        </List>
      </Popover>

      <Modal
        title="Invite"
        open={openInviteUserDialog}
        handleClose={handleCloseInviteDialog}
        width="450px"
      >
        Please enter the email address below to invite someone for collaboration
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          {...inviteeEmail}
        />
        <div style={{ marginTop: '10px' }}>
          <div className="float-right">
            <Button onClick={handleSaveInvite} color="secondary">
              Invite
            </Button>
          </div>
          <div className="float-right">
            <Button color="secondary" onClick={handleCloseInviteDialog}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <Box m={1} flexGrow="1">
        <KanbanView
          ref={kanbanReference}
          boardId={props.match.params.id}
          setBoardName={setBoardName}
        />
      </Box>

      {openAddIssueModal && (
        <AddIssueModal
          boardId={boardId}
          open={openAddIssueModal}
          handleClose={() => setOpenIssueModal(false)}
          afterSave={afterIssueAdded}
        />
      )}
    </Fragment>
  );
};

export default BoardDetails;
