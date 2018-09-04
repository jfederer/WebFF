import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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
	componentDidMount() {
		this.props.appBarTextCB('SedFF Dashboard');

		// pull existing sampling events from props and from LS

		console.log("Dashboard Mounted Props: ", this.props);
	}


	render() {
		const { classes } = this.props;

		//console.log(this.props.samplingEvents);
		let samplingEventNames = this.props.samplingEvents;
		let recentFiveSamplingEvents = samplingEventNames.sort().reverse().slice(0, 5);
		//	console.log("Dashboard Sampling Events: ", samplingEventNames);


		return (
			<React.Fragment>
				<h1>Dashboard</h1>
				<p>General info and status and direct links to items of value</p>
				<Grid container spacing={24}>
					<Grid item xs>
						<Paper className={classes.paper}><h3>Quick Links</h3><br />
							Load Recent Event: <br />
							{recentFiveSamplingEvents.map((samplingEventName) => {
								return <Fragment key={samplingEventName + "_Fragment"}><Link key={samplingEventName} to='/FieldForm'><Button onClick={() => {
									this.props.loadSamplingEvent(samplingEventName);
									this.props.navControl("Water Quality", true);
									this.props.navControl("Field Form", true);
								}}>{samplingEventName}</Button></Link><br /></Fragment>
							})}
							<Link key="allEventsLink" to='/AllEvents'>
								<Button onClick={() => {
									// this.setState({ showAllEvents: true });
								}}>Show all events</Button>
							</Link>
							<br />
							List all shipped events
					<br />
						</Paper>
					</Grid>
					<Grid item xs>
						<Paper className={classes.paper}><b>Event Tracker</b><br />
							Events in Failed Validation Status -- Direct links to events<br />
							Events in Unreviewed Status -- Direct links to events<br />
							Events in Unshipped Status -- Direct links to events<br />
						</Paper>

					</Grid>
				</Grid>
				<Grid container spacing={24}>
					<Grid item xs>
						<Paper className={classes.paper}><b>Create/Start New Sampling Event</b><br />(optionally base on templates)<br />

							<Link to='/FieldForm'><Button onClick={() => {
								this.props.createNewSamplingEvent();
								this.props.navControl("Water Quality", true);
								this.props.navControl("Field Form", true);

							}}>BRAND NEW</Button></Link>

							<Divider />
						</Paper>
					</Grid>
				</Grid>


			</React.Fragment>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withRouter(withStyles(styles, { withTheme: true })(Dashboard));