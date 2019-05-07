import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../style';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';

import SedFF_Logo from '../../Images/SedFF_Logo.png';

import { PROGRAM_VERSION, RELEASE_DATE } from '../../Constants/Version';
import { setAboutDialogVisibility } from '../../Actions/UI';

class AboutDialog extends React.Component {

	render() {
		const { classes } = this.props;
		const { aboutDialogVisibility } = this.props.UI.visibility;

		return (
			<Dialog
				open={aboutDialogVisibility}
				onClose={() => this.props.setAboutDialogVisibility(false)}
				fullWidth
				classes={{ paperFullWidth: classes.dialogCustomizedWidth }}
			>

				<DialogContent>
					<center><img src={SedFF_Logo} width="500" height="200" alt="SedFF Logo" />
						<br />
						Sediment Field Forms version {PROGRAM_VERSION}, released on {RELEASE_DATE}.</center>
					<br />
					<Divider />
					<br />
					SedFF was built by Joe Federer (jfederer@usgs.gov) and Ken Skach (kaskach@usgs.gov) under the direction of Molly Wood (mswood@usgs.gov) as a part of the Hydrologic Networks Branch / Observing Systems Division.
				</DialogContent>
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