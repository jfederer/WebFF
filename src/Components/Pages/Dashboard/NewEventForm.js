import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
// import { Link } from 'react-router-dom';

import { TextField, Button, Paper } from '@material-ui/core';

import { createNewSampingEventForUser } from '../../../Actions/SamplingEvents';
import { showNavigationTab } from '../../../Actions/UI';
import { loadAndSetCurrentSamplingEvent } from '../../../Actions/SedFF';
import { getAllUsersEventIDs } from '../../../Utils/StoreUtilities';


class NewEventForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			newSamplingEventName: "",
			newEventButtonDisabled: false
		}
	}

	handleSamplingEventNameChange = (e) => {
		let allEventsIDs = getAllUsersEventIDs(this.props.currentUser.username);
		let isDuplicate = false;
		allEventsIDs.forEach((eventID) => {
			if (this.props.samplingEvents[eventID]) {
				if (e.target.value.toUpperCase() === this.props.samplingEvents[eventID].eventName.toUpperCase()) {
					isDuplicate = true;
				}
			} else {
				//TODO: trigger network pull?
			}
		})

		this.setState({ newEventButtonDisabled: isDuplicate, newSamplingEventName: e.target.value });
	}

	handleBrandNewButtonClick = () => {
		if (!this.props.currentUser) {
			alert("There is no current user.  You cannot create an event without a current user set.  Please reload sedFF and try again.  If failures continue, contact jfederer@usgs.gov");
			return;
		}
		let newEventID = this.props.createNewSampingEventForUser( // this is a syncronous process
			this.state.newSamplingEventName ? this.state.newSamplingEventName : "",  //deal with blank in action
			this.props.currentUser.username
		);

		this.props.loadAndSetCurrentSamplingEvent(newEventID, () => {
			this.props.history.push("/FieldForm");
			this.props.showNavigationTab("FieldForm");
		});
	}

	onPress = (ev) => {
		if (ev.key === 'Enter' && !this.state.newEventButtonDisabled) {
			this.handleBrandNewButtonClick();
			ev.preventDefault();
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.paper}>
				<div className={classes.dashboardWidgetTitleText}>
					Create/Start New Sampling Event
				</div>

				<div className={classes.horzCenterText}>
					<TextField
						margin="none"
						id="newSamplingEventName"
						label="New Sampling Event Name"
						placeholder="Optional, if left blank, will use date/time"
						onChange={this.handleSamplingEventNameChange}
						value={this.state.newSamplingEventName}
						inputProps={{
							size: 35
						}}
						onKeyPress={(ev) => { this.onPress(ev) }}

					/>

					<br />
					<Button
						className={classes.dashboardWidgetButton}
						// component={MyLink} 
						disabled={this.state.newEventButtonDisabled}
						onClick={this.handleBrandNewButtonClick}
						variant="outlined">
						{this.state.newEventButtonDisabled
							? "EVENT MUST HAVE UNIQUE NAME"
							: "CREATE NEW EVENT"}
					</Button>
				</div>

			</Paper>
		);
	}
}

const mapStateToProps = function (state) {
	return {
		users: state.Users, // to get user settings
		samplingEvents: state.SamplingEvents, //to get list of sampling events to check for uniqueness for that user
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	createNewSampingEventForUser,
	loadAndSetCurrentSamplingEvent,
	showNavigationTab
}

NewEventForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(NewEventForm)));