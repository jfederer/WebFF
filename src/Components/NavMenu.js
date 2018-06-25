import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { navMenu } from '../Services/mockData';
import {styles} from '../style';



class NavMenu extends React.Component {
  render() {
   const { classes } = this.props;
    var navList = (
      <div className={classes.list}>
        <List >{navMenu}</List>
      </div>
    );

	return (
		<Drawer
		variant="permanent"
		classes={{
		  paper: classNames(classes.drawerPaper, !this.props.isExpanded && classes.drawerPaperClose),
		}}
		open={this.props.isExpanded}
	  >
		<div className={classes.toolbar}>
		  <IconButton onClick={this.props.closeHandler}>
			<ChevronLeftIcon />
		  </IconButton>
		</div>
		{navList}
	  </Drawer>
    );
  }
}

NavMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavMenu);