import React, {Fragment, useState} from 'react';
import { Icon, Popover, List, ListItem, ListItemText, Box } from '@material-ui/core';
import AppMenu from '../AppMenu/AppMenu';
import KanbanView from '../KanbanView';

const BoardDetails = props => {
  const boardId = props.match.params.id;
  const [settingAnchorEl, setsettingAnchorEl] = useState(null);
  const openSetting = Boolean(settingAnchorEl);

  const handleSettingClick = function(event) {
    setsettingAnchorEl(event.currentTarget);
  }

  const goToMembers = () => {
    props.history.push(`setting/${boardId}`);
  }
  return (
    <Fragment>
    <AppMenu title="Board Details">
    <Icon style={{fontSize: 30, float: 'right', cursor: 'pointer'}} onClick={handleSettingClick} button>settings</Icon>

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
    <Box m={1}>
      <KanbanView boardId={props.match.params.id} />
    </Box>
    </Fragment>
  );
};

export default BoardDetails;
