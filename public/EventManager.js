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

class EventManager extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB('Event Manager');
	}


	render() {
		const { classes } = this.props;

		console.log(this.props.samplingEvents);
		let samplingEventNames = this.props.samplingEvents;
		let recentFiveSamplingEvents = samplingEventNames.sort().reverse().slice(0, 5);
		//	console.log("Dashboard Sampling Events: ", samplingEventNames);


		return (
			<React.Fragment>

				<p>All Sediment Field form sampling events registered to this user: (click to load)</p>

				{this.props.samplingEvents.map((samplingEventName) => {
					return <Fragment key={samplingEventName + "_Fragment"}><Link key={samplingEventName} to='/FieldForm'><Button onClick={() => {
						this.props.loadSamplingEvent(samplingEventName);
						this.props.navControl("Water Quality", true);
						this.props.navControl("Field Form", true);
					}}>{samplingEventName}</Button></Link><br /></Fragment>
				})}

			</React.Fragment>
		);
	}
}

EventManager.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withRouter(withStyles(styles, { withTheme: true })(EventManager));