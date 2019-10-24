import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	TextField,
	Checkbox,
	Button,
	InputAdornment,
	Typography,
	Paper
} from '@material-ui/core';

import { setSettingsDialogVisibility } from '../../Actions/UI';
import { setOutlineQuestions, setBackupInterval, setSedLoginUsername } from '../../Actions/User';
import { DEFAULT_BACKUP_INTERVAL } from '../../Constants/Config';

var debounce = []; // used for debounce control

class SettingsDialog extends React.Component {
	//TODO: tooltips
	//FUTURE: set a 'saving/saved' element tied to the various setTimeouts
	//FUTURE: settings for Stations, Questions (tied to station or user?)
	//FUTURE: "save settings to db" button
	//FUTURE: import/export settings



	handleClose = () => {
		this.props.setSettingsDialogVisibility(false);
	}

	textFieldChangeHandler = (stateValueName, username, actionCreator) => e => {
		//TODO: if valid (pass in validator function?)
		//TODO: CSS for not valid

		clearTimeout(debounce[stateValueName]);

		this.setState({ [stateValueName]: e.target.value },
			() => {
				debounce[stateValueName] = setTimeout(() => {
					actionCreator(username, this.state[stateValueName]);
				}
					, 2000); // 2 seconds of debounce control
			}
		);
	}



	render() {
		const { classes, settingsDialogVisibility, isFetchingUserData, currentUsername, currentUser, sedLoginUsername, backupInterval } = this.props;

		return (
			<Dialog
				open={settingsDialogVisibility}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">Settings</DialogTitle>
				{currentUser ?
					<DialogContent>
						<Paper>
							{
								!isFetchingUserData || !currentUser ? (
									<Fragment>
										<Typography>User Settings:</Typography>
										<List className={classes.hundredWidth}>
											<ListItem>
												<Checkbox
													checked={currentUser.settings.outlineQuestions}
													onChange={() => this.props.setOutlineQuestions(currentUsername, !currentUser.settings.outlineQuestions)}
												></Checkbox>
												<label>Outline Questions</label>
											</ListItem>
											<ListItem >
												<TextField
													className={classes.settingsTextField}
													label="Auto-Backup Interval"
													value={backupInterval}
													onChange={this.textFieldChangeHandler("backupInterval", currentUsername, this.props.setBackupInterval)}
													InputProps={{
														endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
													}}
												/>
											</ListItem>
											<ListItem >
												<TextField
													className={classes.settingsTextField}
													label="SedLOGIN username"
													value={sedLoginUsername}
													onChange={this.textFieldChangeHandler("sedLoginUsername", currentUsername, this.props.setSedLoginUsername)}
												/>
											</ListItem>
										</List>
									</Fragment>
								) : (
										<h1>User Data Still Loading</h1>
									)}
						</Paper>

					</DialogContent>
					: <DialogContent>Settings dialog is disabled when current user is not set.</DialogContent>
				}
				<DialogActions>
					<Button onClick={this.handleClose} color="primary">
						Done
            		</Button>
				</DialogActions>
			</Dialog >
		);
	}
}



const mapStateToProps = function (state) {

	return {
		settingsDialogVisibility: state.UI.visibility.settingsDialogVisibility,
		isFetchingUserData: state.SedFF.isFetchingUserData,
		currentUsername: state.SedFF.currentUsername,
		currentUser: state.Users[state.SedFF.currentUsername],
		sedLoginUsername: state.Users[state.SedFF.currentUsername] ? state.Users[state.SedFF.currentUsername].sedLoginUsername : state.SedFF.currentUsername,
		backupInterval: state.Users[state.SedFF.currentUsername]
			? state.Users[state.SedFF.currentUsername].settings.backupInterval
			: DEFAULT_BACKUP_INTERVAL

	}
}

const mapDispatchToProps = {
	setSettingsDialogVisibility,
	setOutlineQuestions,
	setBackupInterval,
	setSedLoginUsername
}

SettingsDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SettingsDialog));