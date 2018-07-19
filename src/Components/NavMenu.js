import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { styles } from '../style';



class NavMenu extends React.Component {
	render() {
		const { classes } = this.props;
		var navList = (
			<div className={classes.list}>
				{this.props.menuItems.length!==null ? <List>{this.props.menuItems}</List> : <h6>loading</h6>}
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
	menuItems: PropTypes.array.isRequired  //TODO: sometimes gets object, sometimes gets array... need to fix before we can set this
};

export default withStyles(styles)(NavMenu);