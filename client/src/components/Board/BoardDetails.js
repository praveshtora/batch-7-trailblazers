import React, {Fragment, useState} from 'react';
import { Icon, Popover, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import AppMenu from '../AppMenu/AppMenu';
const BoardDetails = props => {
  const boardId = props.match.params.id;
  const [settingAnchorEl, setsettingAnchorEl] = useState(null);
  const openSetting = Boolean(settingAnchorEl);

  const handleSettingClick = function(event) {
    setsettingAnchorEl(event.currentTarget);
    //props.history.push(`setting/${boardId}`);
  }

  const goToMembers = () => {
    console.log("In");
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
    </Fragment>
  );
};

export default BoardDetails;
