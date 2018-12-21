import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';


import { setAddRemoveStationDialogVisibility } from '../../Actions/UI';

class AddRemoveStationDialog extends React.Component {
	closeHandler = () => {
		this.props.setAddRemoveStationDialogVisibility(false);
	}

	render() {
		const { classes } = this.props;
		const { addRemoveStationDialogVisibility } = this.props.UI.visibility;

		return (
			<Dialog
				open={addRemoveStationDialogVisibility}
				onClose={this.closeHandler}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">Add or Remove Station</DialogTitle>
				<DialogContent>
					Add/Remove Station!!!
				</DialogContent>
				<DialogActions>
					<Button onClick={this.closeHandler} color="primary">
						Done
            		</Button>
				</DialogActions>
			</Dialog>
		);
	}
}



const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility
		user: state.User,
		sedff: state.SedFF
	}
}

const mapDispatchToProps = {
	setAddRemoveStationDialogVisibility: setAddRemoveStationDialogVisibility,
}

AddRemoveStationDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AddRemoveStationDialog));