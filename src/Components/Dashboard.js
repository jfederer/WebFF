import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import EventsManager from './EventsManager';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
});

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

		if (Object.keys(localStorage).includes(this.props.samplingEventIdentifier + e.target.value)) {
			// WARNING, this will overwrite a deleted event
			let matchedEventInLS = JSON.parse(localStorage.getItem(this.props.samplingEventIdentifier + e.target.value));
			if (!matchedEventInLS.deleted) {
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
		this.props.appBarTextCB('SedFF Dashboard');
	}


	render() {
		const { classes } = this.props;


		// let samplingEventNames = this.props.samplingEvents;
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

				<EventsManager
					samplingEventIdentifier={this.props.samplingEventIdentifier}
					createNewSamplingEvent={this.props.createNewSamplingEvent}
					loadSamplingEvent={this.props.loadSamplingEvent}
					samplingEvents={this.props.samplingEvents}
					getEventDetails={this.props.getEventDetails}
					deleteSamplingEvent={this.props.deleteSamplingEvent}
				/>


			</React.Fragment>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withRouter(withStyles(styles, { withTheme: true })(Dashboard));