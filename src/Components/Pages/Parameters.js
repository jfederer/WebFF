import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';

import ParametersTable from '../Questions/ParametersTable';
import { getQuestionValue, getDescriptiveColumnForTable } from '../../Utils/QuestionUtilities';
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

		let table_QID = "parametersTable";

		return (
			<div>
				Parameters Page!!
							<ParametersTable
					stateChangeHandler={(val) => this.props.SEQuestionValueChange(currentEventID, table_QID, val)} //TODO: NEXT:  This isn't called with appropraite information
					value={getQuestionValue(currentEventID, table_QID)}
					key={table_QID}
					id={table_QID}
					label="parametersTable LABEL"
					placeholder="parametersTable PLACEHOLDER"
					XMLTag="parametersTable XMLTAG"
					type="ParametersTable"
					getDescriptiveColumnForTable={()=>getDescriptiveColumnForTable(currentEventID)}
					eventID={this.props.currentEventID}
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