// This file is shared across the demos.

import React from 'react';
import Icons from '@material-ui/icons';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import OpacityIcon from '@material-ui/icons/Opacity';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import {styles} from '../theme';
import classNames from 'classnames';

export const systemMenu = (
  <div>
	<ListItem button>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>
      <ListItemText primary="User Manual" />
    </ListItem>

	<ListItem button>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>

		<ListItem button>
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="About" />
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <PermIdentityIcon />
      </ListItemIcon>
      <ListItemText primary="Switch User" /> {/* TODO: Login toggle? */}
    </ListItem>
  </div>
);

export var navMenu = (
	<div>
	  <ListItem button>
		<ListItemIcon>
		  <DashboardIcon />
		</ListItemIcon>
		<ListItemText className={styles.navMenuText} primary="Dashboard" />
	  </ListItem>

	  <ListItem button>
		<ListItemIcon>
		  <ImportContactsIcon />
		</ListItemIcon>
		<ListItemText className={styles.navMenuText} primary="Field Form" />
	  </ListItem>
  
	  <ListItem button>
		<ListItemIcon>
		  <OpacityIcon />
		</ListItemIcon>
		<ListItemText primary="Water Quality" />
	  </ListItem>
  
	  <ListItem button>
		<ListItemIcon>
		  <SettingsInputComponentIcon />
		</ListItemIcon>
		<ListItemText primary="Collection" />
	  </ListItem>
	</div>
  );