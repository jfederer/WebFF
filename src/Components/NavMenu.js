import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { styles } from '../style';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { materialIconBuilder } from '../Utils/MaterialIcons';

import { navMenuItems } from '../Constants/NavMenu';
import { setNavMenuExpand } from '../Actions/UI';


class NavMenu extends React.Component {
	render() {
		const { classes } = this.props;
		const { hiddenNavMenuItems, expandedNavMenu } = this.props.UI.visibility;

		return (
			<Drawer
				variant="permanent"
				classes={{
					paper: classNames(classes.drawerPaper, !expandedNavMenu && classes.drawerPaperClose),
				}}
				open={expandedNavMenu}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={() => this.props.setNavMenuExpand(false)}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<List>
					{navMenuItems.map((menuItem) => {
						return (
							hiddenNavMenuItems === undefined || !hiddenNavMenuItems.includes(menuItem.text)
								? <ListItem key={menuItem.route + "_key"} button component={Link} to={menuItem.route}>
									<ListItemIcon>
										{materialIconBuilder(menuItem.icon)}
									</ListItemIcon>
									<ListItemText className={styles.navMenuText} primary={menuItem.text} />
								</ListItem>
								: null
						)
					})}

				</List>
			</Drawer>
		);
	}
}

NavMenu.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = function (state) {
	return {
		UI: state.UI,
	}
}

const mapDispatchToProps = {
	setNavMenuExpand: setNavMenuExpand,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NavMenu));