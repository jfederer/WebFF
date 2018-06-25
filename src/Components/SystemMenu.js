import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { systemMenu } from '../Services/mockData';
import 'typeface-roboto';
import {styles} from '../style';

class SystemMenu extends React.Component {
  render() {
   const { classes } = this.props;

    const sysList = (
      <div className={classes.list}>
        <List>{systemMenu}</List>
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
             {sysList}
           </div>
         </Drawer>
    );
  }
}

SystemMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SystemMenu);