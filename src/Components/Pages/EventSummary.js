import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import { getEventFromID } from '../../Utils/StoreUtilities';

import { setAppBarText } from '../../Actions/UI'; //TODO: we don't atually set appbar text

class EventSummary extends React.Component {

	render() {
		
		const { eventID } = this.props.match.params
		console.log("EvtSum");

		// if (!event) {
		// 	console.log("No current event, redirecting to dashboard");
		// 	return <Redirect to='/' />
		// }
		
		return "EVENT SUMMARY: " + getEventFromID(eventID);

	}
}

const mapStateToProps = function (state) {
	return {
		// linkTables: state.LinkTables, // to get users event IDs
		// allSamplingEvents: state.SamplingEvents,
		//sedff: state.SedFF, // loading / fetching data
		// currentUser: state.Users[state.SedFF.currentUsername],
		//samplingEvents: state.SamplingEvents,
		// questions: state.Questions,
	}
}


EventSummary.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, {	withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(EventSummary));