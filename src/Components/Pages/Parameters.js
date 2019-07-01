import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';

import ParametersTable from '../Questions/ParametersTable';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';

class Parameters extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Parameters");
	}

	render() {
		const {
			currentEvent,
			currentEventID
		} = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (
			<div>
				Parameters Page!!
							<ParametersTable
					stateChangeHandler={this.props.SEQuestionValueChange}
					value={getQuestionValue(currentEventID, "ParametersTable")}
					key="ParametersTable"
					id="ParametersTable"
					label="ParametersTable LABEL"
					placeholder="ParametersTable PLACEHOLDER"
					XMLTag="ParametersTable XMLTAG"
					type="ParametersTable"
				/>
			</div>
		);
	}
}


const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		defaultQuestionsData: state.Questions.questionsData,
	}
}


const mapDispatchToProps = {
	setAppBarText,
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Parameters));