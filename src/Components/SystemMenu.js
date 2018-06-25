import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { systemMenu } from '../Services/mockData';
import 'typeface-roboto';
import {styles} from '../theme';

class SystemMenu extends React.Component {
  render() {
   const { classes, theme } = this.props;

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

// SystemMenu.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles)(SystemMenu);