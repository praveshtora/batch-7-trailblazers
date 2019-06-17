import React, {Fragment, useState} from 'react';
import { Icon, Popover, List, ListItem, ListItemText, Box } from '@material-ui/core';
import AppMenu from '../AppMenu/AppMenu';
import KanbanView from '../KanbanView';
import Button from './../Button';
import AddIssueModal from './AddIssueModal';

const BoardDetails = props => {
  const boardId = props.match.params.id;
  const [settingAnchorEl, setsettingAnchorEl] = useState(null);
  const openSetting = Boolean(settingAnchorEl);
  const [openAddIssueModal, setOpenIssueModal] = useState(false);
  const handleSettingClick = function(event) {
    setsettingAnchorEl(event.currentTarget);
  }

  const goToMembers = () => {
    props.history.push(`setting/${boardId}`);
  }

  const afterIssueAdded = () => {
    
  }

  return (
    <Fragment>
    <AppMenu title="Board Details">
    <Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} onClick={handleSettingClick}>settings</Icon>

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
          <ListItem onClick={goToMembers}>
            <ListItemText primary="Members" />
          </ListItem>
        </List>
      </Popover>
    </AppMenu>
    
    <Button onClick={()=>setOpenIssueModal(true)} ><Icon>add</Icon>New Issue</Button>

    <Box m={1}>
      <KanbanView boardId={props.match.params.id} />
    </Box>

    <AddIssueModal boardId={boardId} open={openAddIssueModal} handleClose={() => setOpenIssueModal(false)}
      afterSave={afterIssueAdded}/>
    </Fragment>
  );
};

export default BoardDetails;
