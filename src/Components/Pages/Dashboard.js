import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { TextField, Grid, Divider, Button, Paper } from '@material-ui/core';

import EventsManager from '../Common/EventsManager';

class Dashboard extends React.Component {


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

	componentDidMount() {
		// this.props.appBarTextCB('SedFF Dashboard');
	}



	render() {
		const { classes, currentUser } = this.props;
		const {currentUsername} = this.props.sedff;

	//	let samplingEvents = users[currentUsername]
		
		//eventIDs.map((id)=>this.props.events[id]);

		console.log(currentUser);

		 //= this.props.samplingEvents;
		//	console.log("Dashboard Sampling Events: ", samplingEventNames);

		const MyLink = props => <Link to="/FieldForm" {...props} />

		// console.log("DB: PROPS: SEs:", this.props.samplingEvents );

		return (
			<React.Fragment>
				<h1>SedFF Dashboard</h1>
				{/* <Grid container spacing={24}>
					<Grid item xs>
						<Paper className={classes.paper}><h3>Load Recent Event:</h3><br />
							{recentFiveSamplingEvents.map((samplingEventName) => {
								return <Fragment key={samplingEventName + "_Fragment"}><Link key={samplingEventName} to='/FieldForm'><Button onClick={() => {
									this.props.loadSamplingEvent(samplingEventName);
									this.props.navControl("Water Quality", true);
									this.props.navControl("Field Form", true);
								}}>{samplingEventName}</Button></Link><br /></Fragment>
							})}
						</Paper>
					</Grid>
					<Grid item xs>
						<Paper className={classes.paper}><b>Event Tracker</b><br />
						<Link key="allEventsLink" to='/EventsManager'>
								<Button onClick={() => {
								}}>Show Event Manager</Button>
							</Link>
						</Paper>
					</Grid>
				</Grid> */}
				<Grid container spacing={24}>
					<Grid item xs>
						<Paper className={classes.paper}><b>Create/Start New Sampling Event</b><br /><br />

							{/* <Link to='/FieldForm'> */}
							<TextField
								margin="dense"
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
								// component={MyLink} 
								disabled={this.state.newEventButtonDisabled}
								onClick={this.handleBrandNewButtonClick}
								variant="outlined">
								{this.state.newEventButtonDisabled
									? "EVENT MUST HAVE UNIQUE NAME"
									: "CREATE NEW EVENT"}
							</Button>
							<Divider />
						</Paper>
					</Grid>
				</Grid>

				{/* <EventsManager
					samplingEventIdentifier={this.props.samplingEventIdentifier}
					createNewSamplingEvent={this.props.createNewSamplingEvent}
					loadSamplingEvent={this.props.loadSamplingEvent}
					samplingEvents={this.props.samplingEvents}
					getEventDetails={this.props.getEventDetails}
					deleteSamplingEvent={this.props.deleteSamplingEvent}
				/> */}


			</React.Fragment>
		);
	}
}

const mapStateToProps = function (state) {
	return {
		UI: state.UI, // to get dialog visibility 
		users: state.Users, // to get user settings
		sedff: state.SedFF,
		events: state.Events,
		currentUser: state.Users[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withRouter(
	withStyles(styles, { withTheme: true })
		(connect(mapStateToProps, mapDispatchToProps)
			(Dashboard)
		)
);