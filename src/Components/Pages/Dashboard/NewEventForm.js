import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { TextField, Grid, Divider, Button, Paper } from '@material-ui/core';

import { createNewSamplingEvent } from '../../../Actions/SamplingEvents';

class NewEventForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			newSamplingEventName: "",
			newEventButtonDisabled: false
		}
	}

	handleSamplingEventNameChange = (e) => {
		this.setState({ newSamplingEventName: e.target.value });

		if (Object.keys(this.props.events).includes(e.target.value)) {
			// WARNING, this will overwrite a deleted event
			let matchedEvent = this.props.events[e.target.value];
			if (!matchedEvent.deleted) {
				this.setState({ newEventButtonDisabled: true });
			}
		} else {
			this.setState({ newEventButtonDisabled: false });
		}
	}

	handleBrandNewButtonClick = () => {
		// console.log("handleBrandNewButtonClick()");

		this.props.createNewSamplingEvent(this.state.newSamplingEventName
			? this.state.newSamplingEventName
			: ""
			,
			() => this.props.history.push('/FieldForm')
		);
		this.props.navControl("Water Quality", true);
		this.props.navControl("Field Form", true);
	}


	render() {
		const { classes, currentUser } = this.props;
		const { currentUsername } = this.props.sedff;

		const MyLink = props => <Link to="/FieldForm" {...props} />

		return (
			<Paper className={classes.paper}>
				<div className={classes.dashboardWidgetTitleText}>
					Create/Start New Sampling Event
				</div>

				{/* <Link to='/FieldForm'> */}
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
		sedff: state.SedFF,
		samplingEvents: state.SamplingEvents,
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	createNewSamplingEvent
}

NewEventForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(
	withStyles(styles, { withTheme: true })
		(connect(mapStateToProps, mapDispatchToProps)
			(NewEventForm)
		)
);