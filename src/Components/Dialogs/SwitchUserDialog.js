import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import {isReasonableUsername} from '../../Utils/ValidationUtilities';
import { setSwitchUserDialogVisibility } from '../../Actions/UI';
import { loadAndSetCurrentUser } from '../../Actions/SedFF';

const initialState =  { newUsername: ""};

class SwitchUserDialog extends React.Component {

	constructor(props){
		super(props);
		this.state = initialState;
	  }

	handleClose = () => {
		this.props.setSwitchUserDialogVisibility(false);
		setTimeout(this.setState(initialState), 250);
	}

	handleSwitchUser = () => {
		this.props.loadAndSetCurrentUser(this.state.newUsername);
		this.handleClose();
	}

	handleTextChange = (e) => {
		this.setState({newUsername:e.target.value});
	}

	isNewUsernameValid = () => {
		return isReasonableUsername(this.state.newUsername); // note, we are not checking that the username is different than the current because this might be a good way to backdoor reload a user.
	}


	render() {
		const { classes } = this.props;
		const { switchUserDialogVisibility } = this.props.UI.visibility;
		const { currentUsername } = this.props.sedff;

		return (
			<Dialog
				open={switchUserDialogVisibility}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">Switch User</DialogTitle>
				<DialogContent>
					All your SedFF data is associated with your username.  For most, this will be your email address.  Your username must end in @usgs.gov.  If you wish to log in to SedFF with a different username, enter it below.
					<Divider />			
					<br />		
					The currently logged in user is: <em>{currentUsername}</em>
					<Divider />
					<br />
					<br />
					<TextField
							autoFocus
                            margin="dense"
                            id="newusername"
                            placeholder="username@usgs.gov"
                            label="Enter New Username"
                            type="email"
                            fullWidth
                            onChange={this.handleTextChange}
                            value={this.state.newUsername}
                        />
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleSwitchUser} disabled={!this.isNewUsernameValid()} color="primary">
						Switch
            		</Button>
					<Button onClick={this.handleClose} color="primary">
						Cancel
            		</Button>
				</DialogActions>
			</Dialog>
		);
	}
}



const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility
		sedff: state.SedFF // to get current user
	}
}

const mapDispatchToProps = {
	setSwitchUserDialogVisibility,
	loadAndSetCurrentUser
}

SwitchUserDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SwitchUserDialog));