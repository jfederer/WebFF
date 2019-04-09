import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { TextField, Grid, Divider, Button, Paper } from '@material-ui/core';

import { setAppBarText } from '../../../Actions/UI';

import EventsManager from './EventsManager';
import NewEventForm from './NewEventForm';
import { classNames } from 'classnames';

class Dashboard extends React.Component {
	//FUTURE: Load most recent X events widget
	//FUTURE: Event Tracker (view unshipped, view under review, etc)

	constructor(props) {
		super(props);
		this.props.setAppBarText("Sediment Field Forms");
	}

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<h1>SedFF Dashboard</h1>
				<Grid 
					container
					direction="column"
					justify="center"
					alignItems="center"
					spacing={16}
				>
					<Grid item xs className={classes.hundredWidth}>
						<NewEventForm  />
					</Grid>
					<Grid item xs className={classes.hundredWidth}>
						<EventsManager />
					</Grid>
				</Grid>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setAppBarText
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })
	(connect(null, mapDispatchToProps)
		(Dashboard)
	);