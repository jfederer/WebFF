import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import SedFF_Logo from '../../Images/SedFF_Logo.png';
import { PROGRAM_VERSION, RELEASE_DATE } from '../../Constants/Version';
import { isReasonableUsername } from '../../Utils/ValidationUtilities';
import { setLoginDialogVisibility } from '../../Actions/UI';
import { loadAndSetCurrentUser } from '../../Actions/SedFF';

const initialState = {
	username: '',
	toDashboard: false,
	showLoginButton: false
};

class LoginDialog extends React.Component {


	constructor(props) {
		super(props);
		this.state = _.cloneDeep(initialState);

	}

	handleClose = () => {
		this.props.setLoginDialogVisibility(false);
		setTimeout(this.setState(initialState), 250);
	}

	handleLoginPress = () => {
		this.props.loadAndSetCurrentUser(this.state.username);
		this.handleClose();
	}

	handleTextChange = (e) => {
		this.setState({ username: e.target.value });
	}

	isNewUsernameValid = () => {
		return isReasonableUsername(this.state.username); // note, we are not checking that the username is different than the current because this might be a good way to backdoor reload a user.
	}

	onPress = (ev) => {
		console.log(`Pressed keyCode ${ev.key}`);
		if (ev.key === 'Enter' && this.isNewUsernameValid()) {
			this.handleLoginPress();
			ev.preventDefault();
		}
	}


	render() {
		const { classes, loginDialogVisibility } = this.props;

		return (
			<Dialog
				open={loginDialogVisibility}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">Log In</DialogTitle>
				<center><img src={SedFF_Logo} width="500" height="200" alt="SedFF Logo" />
					<br />
					Sediment Field Forms version {PROGRAM_VERSION}, released on {RELEASE_DATE}.
					<br /></center>
				<Divider></Divider>
				<DialogContent>
					<br />
					All your SedFF data is associated with your username.
					For most, this will be your @usgs.gov email address.
					SedFF uses your email address to save all your events, settings, and customizations to the local computer as well attempt to sync to national databases.
						You should only be asked this once per computer and you can change your login ID using the "switch user" option in the system menu.<br />



					<br />
					<TextField
						autoFocus
						margin="dense"
						id="newusername"
						placeholder="username@usgs.gov"
						label="Enter Username"
						type="email"
						fullWidth
						onChange={this.handleTextChange}
						value={this.state.username}
						onKeyPress={(ev) => { this.onPress(ev) }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleLoginPress} disabled={!this.isNewUsernameValid()} color="primary">
						Login
            		</Button>
				</DialogActions>
			</Dialog>
		);
	}
}



const mapStateToProps = function (state) {
	return {
		loginDialogVisibility: state.UI.visibility.loginDialogVisibility, // to get dialog visibility
	}
}

const mapDispatchToProps = {
	setLoginDialogVisibility,
	loadAndSetCurrentUser
}

LoginDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(LoginDialog));