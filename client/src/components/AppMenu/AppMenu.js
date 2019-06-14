import React from "react";
import { Typography, Divider } from '@material-ui/core';
import './AppMenu.css';


const AppMenu = (props) => {

  return <div className="app-menu">
    <Typography variant="h5" gutterBottom>
        {props.title}
        {props.children}
      </Typography>
     <Divider light />
    </div>
}

export default AppMenu;
