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


import { setAboutDialogVisibility } from '../../Actions/UI';

class AboutDialog extends React.Component {
	closeHandler = () => {
		this.props.setAboutDialogVisibility(false);
	}

	render() {
		const { classes } = this.props;
		const { aboutDialogVisibility } = this.props.UI.visibility;

		return (
			<Dialog
				open={aboutDialogVisibility}
				onClose={this.closeHandler}
				aria-labelledby="form-dialog-title"
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>
				<DialogTitle id="form-dialog-title">About SedFF</DialogTitle>
				<DialogContent>
					About!!!
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
	}
}

const mapDispatchToProps = {
	setAboutDialogVisibility: setAboutDialogVisibility,
}

AboutDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AboutDialog));