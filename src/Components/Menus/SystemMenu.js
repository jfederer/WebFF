import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import 'typeface-roboto';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { materialIconBuilder } from '../../Utils/MaterialIcons';

//Action Creators
import { syncToDB } from '../../Actions/DB';
import {
	setSysMenuExpand,
	setExportDialogVisibility,
	setAddRemoveStationDialogVisibility,
	setAddRemoveQuestionDialogVisibility,
	setSettingsDialogVisibility,
	setAboutDialogVisibility,
	setSwitchUserDialogVisibility
} from '../../Actions/UI';



const styles = {
	list: {
		width: 'auto',
	},
	noUnderline: {
		textDecoration: 'none'
	}
};



//TODO: move handler entirely to reducer


class SystemMenu extends React.Component {


	// menuItemClickHandler(menuText) {
	// 	if (menuText === "Save XML") {
	// 		this.handleXMLDialogOpen();
	// 		return;
	// 	}
	// 	if (menuText === "About") {
	// 		alert("This is Sediment Field Forms (SedFF) version " + PROGRAM_VERSION + " built by jfederer@usgs.gov and kaskach@usgs.gov on Nov 14, 2018");
	// 		return;
	// 	}

	// 	if (menuText === "Add/Remove Question") {
	// 		this.handleQuestionDialogOpen();
	// 		return;
	// 	}


	// 	if (menuText === "Sync Data to Database") {
	// 		this.updateDatabase();
	// 		return;
	// 	}


	// 	// actually opening dialog 
	// 	// build the curDialogXXX data
	// 	this.setState({ curDialogName: menuText });

	// 	let filteredDialogInfo = this.state.dialogQuestions.filter((dialogItem) => {
	// 		return dialogItem.dialogName.replace(/ /g, '') === menuText.replace(/ /g, '')
	// 	});

	// 	if (filteredDialogInfo && filteredDialogInfo.length === 1) {
	// 		this.setState({
	// 			curDialogDescription: filteredDialogInfo[0].dialogDescription,
	// 			curDialogName: menuText,
	// 			curDialogQuestions: filteredDialogInfo[0].questions
	// 		}, () => { //open the dialog 
	// 			this.handleDialogOpen();
	// 		}
	// 		);

	// 	} else {
	// 		//TODO: ERR
	// 		console.log(menuText + " is not yet implemented");
	// 	}

	// }

	closeHandler = () => {
		this.props.setSysMenuExpand(false);
	}

	render() {
		const {
			classes,
			syncToDB,
			setExportDialogVisibility,
			setAddRemoveStationDialogVisibility,
			setAddRemoveQuestionDialogVisibility,
			setSettingsDialogVisibility,
			setAboutDialogVisibility,
			setSwitchUserDialogVisibility
		} = this.props;

		const { expandedSysMenu } = this.props.UI.visibility;

		return (
			<Drawer
				anchor="right"
				open={expandedSysMenu}
				onClose={this.closeHandler}
				ref="systemMenu">
				<div
					tabIndex={0}
					role="button"
					onClick={this.closeHandler}
					onKeyDown={this.closeHandler}
				>
					<List>
						{/* <ListItem button onClick={() => this.props.menuItemClickHandler('Test')}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Test" />
          </ListItem> */}
						<ListItem button onClick={setExportDialogVisibility} >
							<ListItemIcon>
							{materialIconBuilder("CodeIcon")}
							</ListItemIcon>
							<ListItemText primary="Save XML" />
						</ListItem>

						<ListItem button onClick={syncToDB}>
							<ListItemIcon>
							{materialIconBuilder("SyncIcon")}
							</ListItemIcon>
							<ListItemText primary="Sync Data to Database" />
						</ListItem>

						<ListItem button onClick={setAddRemoveStationDialogVisibility}>
							<ListItemIcon>
							{materialIconBuilder("NoteAddIcon")}
							</ListItemIcon>
							<ListItemText primary="Add/Remove Station" />
						</ListItem>

						<ListItem button onClick={setAddRemoveQuestionDialogVisibility}>
							<ListItemIcon>
							{materialIconBuilder("HelpIcon")}
							</ListItemIcon>
							<ListItemText primary="Add/Remove Question" />
						</ListItem>

						<a className={classes.noUnderline} href="https://docs.google.com/document/d/15rctoHyXupM6MiDQSHd9Hfb4nxkssAXY3lI7DThjYNc/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
							<ListItem button onClick={this.closeHandler}>
								<ListItemIcon>
								{materialIconBuilder("ImportContactsIcon")}
								</ListItemIcon>
								<ListItemText primary="User Manual" />
							</ListItem>
						</a>

						<ListItem button onClick={setSettingsDialogVisibility}>
							<ListItemIcon>
							{materialIconBuilder("SettingsIcon")}
							</ListItemIcon>
							<ListItemText primary="Settings" />
						</ListItem>

						{/* <ListItem button onClick={() => this.menuItemClickHandler('About')}> */}
						<ListItem button onClick={setAboutDialogVisibility}>
							<ListItemIcon>
							{materialIconBuilder("InfoIcon")}
							</ListItemIcon>
							<ListItemText primary="About" />
						</ListItem>

						<ListItem button onClick={setSwitchUserDialogVisibility}>
							<ListItemIcon>
							{materialIconBuilder("PermIdentityIcon")}
							</ListItemIcon>
							<ListItemText primary="Switch User" /> {/* TODO: Users-on-machine toggle? */}
						</ListItem>
					</List>
				</div>
			</Drawer>
		);
	}
}

const mapStateToProps = function (state) {
	return {
		UI: state.UI
	}
}

const mapDispatchToProps = {
	setSysMenuExpand: setSysMenuExpand,
	syncToDB: syncToDB,
	setExportDialogVisibility: ()=>setExportDialogVisibility(true),
	setAddRemoveStationDialogVisibility: ()=>setAddRemoveStationDialogVisibility(true),
	setAddRemoveQuestionDialogVisibility: ()=>setAddRemoveQuestionDialogVisibility(true),
	setSettingsDialogVisibility: ()=>setSettingsDialogVisibility(true),
	setAboutDialogVisibility: ()=>setAboutDialogVisibility(true),
	setSwitchUserDialogVisibility: ()=>setSwitchUserDialogVisibility(true) 
}

SystemMenu.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SystemMenu));