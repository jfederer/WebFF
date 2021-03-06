import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';
import { QWDATA_TABLE_TYPE } from '../../Constants/Config';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import TabbedPage from './TabbedPage';

class QWDATA extends React.Component {
	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Parameters");
	}


	render() {
		const {
			currentEvent,
		} = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (<React.Fragment>
			<TabbedPage componentType={QWDATA_TABLE_TYPE} />
		</React.Fragment >
		);
	}


	// constructor(props) {
	// 	super(props);
	// 	this.props.setAppBarText("SedFF → QWDATA");
	// }

	// render() {

	// 	const {
	// 		currentEvent,
	// 		currentEventID,
	// 		defaultQuestionsData
	// 	} = this.props;

	// 	if (!currentEvent) {
	// 		console.log("No current event, redirecting to dashboard");
	// 		return <Redirect to='/' />
	// 	}

	// 	let table_QID = "QWDATATable";

	// 	return (
	// 		<div>
	// 			QWDATA Page!!
	// 				<QWDATATable
	// 				stateChangeHandler={(val) => this.props.SEQuestionValueChange(currentEventID, table_QID, val)}
	// 				value={getQuestionValue(currentEventID, table_QID)}
	// 				getQuestionValue={(QID) => getQuestionValue(currentEventID, QID)}
	// 				getQuestionData={(QID) => getQuestionDataFromID(QID)}
	// 				key={table_QID}
	// 				id={table_QID}
	// 				label="QWDATATable LABEL"
	// 				placeholder="QWDATATable PLACEHOLDER"
	// 				XMLTag="QWDATATable XMLTAG"
	// 				type="QWDATATable"
	// 			/>
	// 		</div>
	// 	);
	// }
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(QWDATA));