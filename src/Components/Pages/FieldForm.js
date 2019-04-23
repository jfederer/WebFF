import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';

import QuestionPage from './../QuestionPage';


class FieldForm extends React.Component {

	render() {
		
		const { currentEvent } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		//TODO: NEXT:   Render questions on Field Form Page
		
		return <QuestionPage tabName="Field Form"/>

	}
}

const mapStateToProps = function (state) {
	return {
		// linkTables: state.LinkTables, // to get users event IDs
		// allSamplingEvents: state.SamplingEvents,
		//sedff: state.SedFF, // loading / fetching data
		// currentUser: state.Users[state.SedFF.currentUsername],
		//samplingEvents: state.SamplingEvents,
		questions: state.Questions,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, {	withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(FieldForm));