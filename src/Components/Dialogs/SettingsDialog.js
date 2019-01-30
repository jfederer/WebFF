import React from 'react';
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

var debounce = []; // used for debounce control

class SettingsDialog extends React.Component {
	//TODO: tooltips
	//FUTURE: set a 'saving/saved' element tied to the various setTimeouts
	//FUTURE: settings for Stations, Questions (tied to station or user?)
	//FUTURE: "save settings to db" button
	//FUTURE: import/export settings

	constructor(props) {
		super(props);
		this.state = {
			backupInterval: this.props.user.settings.backupInterval,
			sedLoginUsername: this.props.user.sedLoginUsername,
		};
	}

	handleClose = () => {
		this.props.setSettingsDialogVisibility(false);
	}

	textFieldChangeHandler = (stateValueName, actionCreator) => e => {
		//TODO: if valid (pass in validator function?)
		//TODO: CSS for not valid

		clearTimeout(debounce[stateValueName]);
	
		this.setState({ [stateValueName]: e.target.value },
			() => {
				debounce[stateValueName] = setTimeout(() => {
					actionCreator(this.state[stateValueName]);
				}
				, 2000); // 2 seconds of debounce control
			}
		);
	}



	render() {
		const { classes } = this.props;
		const { settingsDialogVisibility } = this.props.UI.visibility;
		const { outlineQuestions } = this.props.user.settings;

		return (
			<Dialog
				open={settingsDialogVisibility}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">Settings</DialogTitle>
				<DialogContent>
					<Paper>
						<Typography>User Settings:</Typography>
						<List className={classes.hundredWidth}>
							<ListItem>
								<Checkbox
									checked={outlineQuestions}
									onChange={() => this.props.setOutlineQuestions(!outlineQuestions)}
								></Checkbox>
								<label>Outline Questions</label>
							</ListItem>
							<ListItem >
								<TextField
									className={classes.settingsTextField}
									label="Auto-Backup Interval"
									value={this.state.backupInterval}
									onChange={this.textFieldChangeHandler("backupInterval", this.props.setBackupInterval)}
									InputProps={{
										endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
									}}
								/>
							</ListItem>
							<ListItem >
								<TextField
									className={classes.settingsTextField}
									label="SedLOGIN username"
									value={this.state.sedLoginUsername}
									onChange={this.textFieldChangeHandler("sedLoginUsername", this.props.setSedLoginUsername)}
								/>
							</ListItem>
						</List>
					</Paper>

				</DialogContent>
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
		UI: state.UI, // to get dialog visibility 
		user: state.User, // to get user settings
		sedff: state.SedFF
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