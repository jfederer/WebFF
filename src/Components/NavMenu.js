import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { styles } from '../style';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import OpacityIcon from '@material-ui/icons/Opacity';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReorderIcon from '@material-ui/icons/Reorder';
import ColorizeIcon from '@material-ui/icons/Colorize';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import StraightenIcon from '@material-ui/icons/Straighten';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/PersonAdd';
import CompareIcon from '@material-ui/icons/Compare';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import AssignmentIcon from '@material-ui/icons/Assignment';

class NavMenu extends React.Component {

	jsonToNavMenu(jsonNavData) {
		// this function filters tabs based on the "showXYZ" items in state
		// console.log(jsonNavData);
		var retMenu = [];
		for (var i = 0; i < jsonNavData.length; i++) {
			var menuItem = jsonNavData[i];
			var shouldInclude = !this.props.hiddenTabs.includes(menuItem.text.replace(/ /g, ''));
	
			// use icon?
			let useIcon = true;
			if (menuItem.icon === "") {
				useIcon = false;
			}
	
			if (shouldInclude) retMenu.push(
				<ListItem key={menuItem.route + "_key"} button component={Link} to={menuItem.route}>
					{(useIcon) ? <ListItemIcon>
						{this.materialIcon(menuItem.icon)}
					</ListItemIcon> : null}
					<ListItemText className={styles.navMenuText} primary={menuItem.text} />
				</ListItem>
			);
		}
		return retMenu;
	}
	
	materialIcon(icon) {
		switch (icon) {
			case 'DashboardIcon': return <DashboardIcon />
			case 'ImportContactsIcon': return <ImportContactsIcon />
			case 'OpacityIcon': return <OpacityIcon />
			case 'ReorderIcon': return <ReorderIcon />
			case 'ColorizeIcon': return <ColorizeIcon />
			case 'FilterDramaIcon': return <FilterDramaIcon />
			case 'StraightenIcon': return <StraightenIcon />
			case 'LibraryAddIcon': return <LibraryAddIcon />
			case 'PlaylistAddIcon': return <PlaylistAddIcon />
			case 'PersonAddIcon': return <PersonAddIcon />
			case 'GroupAddIcon': return <GroupAddIcon />
			case 'PlaylistAddCheckIcon': return <PlaylistAddCheckIcon />
			case 'NoteAddIcon': return <NoteAddIcon />
			case 'EditIcon': return <EditIcon />
			case 'CompareIcon': return <CompareIcon />
			case 'SaveIcon': return <SaveIcon />
			case 'SubtitlesIcon': return <SubtitlesIcon />
			case 'AssignmentIcon': return <AssignmentIcon />

			//FUTURE: additional good ones:  blur*, edit* (gives editor options...)
			default: return <SettingsInputComponentIcon />
		}
	}

	render() {
		const { classes } = this.props;

		let menuItems = this.jsonToNavMenu(this.props.navMenuInfo);

		var navList = (
			<div className={classes.list}>
				{menuItems.length!==null ? <List>{menuItems}</List> : <h6>loading</h6>}
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
	navMenuInfo: PropTypes.array.isRequired  
};

export default withStyles(styles)(NavMenu);