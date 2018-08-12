import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import 'typeface-roboto';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import BuildIcon from '@material-ui/icons/Build';
import SyncIcon from '@material-ui/icons/Sync';

const styles = {
  list: {
    width: 'auto',
  }
};

//TODO: Put these options in DB, add Icons to IconSelector in WebFF, add Fetch, map through.
//HARDCODE!!!!

class SystemMenu extends React.Component {
  render() {
    const { classes } = this.props;

    const systemMenu = (
      <div className={classes.list}>
        <List>
        <ListItem button onClick={()=>this.props.menuItemClickHandler('Test')}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Test" />
          </ListItem>
		  <ListItem button onClick={()=>this.props.menuItemClickHandler('Sync Current Event to Database')}>
            <ListItemIcon>
              <SyncIcon />
            </ListItemIcon>
            <ListItemText primary="Sync Current Event to Database" />
          </ListItem>
          <ListItem button onClick={()=>this.props.menuItemClickHandler('Add/Remove Station')}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add/Remove Station" />
          </ListItem>
          <ListItem button onClick={()=>this.props.menuItemClickHandler('Add New Question')}>
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Question" />
          </ListItem>

          <ListItem button onClick={()=>this.props.menuItemClickHandler('User Manual')}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="User Manual" />
          </ListItem>

          <ListItem button onClick={()=>this.props.menuItemClickHandler('Settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>

          <ListItem button onClick={()=>this.props.menuItemClickHandler('About')}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          <ListItem button onClick={()=>this.props.menuItemClickHandler('Switch User')}>
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            <ListItemText primary="Switch User" /> {/* TODO: Login toggle? */}
          </ListItem>
        </List>
      </div>
    );

    return (
      <Drawer
        anchor="right"
        open={this.props.isOpen}
        onClose={this.props.closeHandler}
        ref="systemMenu">
        <div
          tabIndex={0}
          role="button"
          onClick={this.props.closeHandler}
          onKeyDown={this.props.closeHandler}
        >
          {systemMenu}
        </div>
      </Drawer>
    );
  }
}

SystemMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SystemMenu);