import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import { getEventFromID, getQuestionsData, getQuestionDataFromID } from '../../Utils/StoreUtilities';

import { setAppBarText } from '../../Actions/UI'; //TODO: we don't atually set appbar text
import { DATA_ENTRY_INFORMATION_IDENTIFIER, QWDATA_TABLE_IDENTIFIER, PARAMETERS_TABLE_IDENTIFIER, SEDIMENT_TYPES } from '../../Constants/Config';
import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { getQuestionValue, getTabQuestionsData, getLayoutGroupNames, getLayoutGroupQuestionsData } from '../../Utils/QuestionUtilities';


class EventSummary extends React.Component {


	// QIDs_stationBasics = [
	// 	"stationName",
	// 	"stationNumber",
	// 	"projectName",
	// 	"projectID",
	// 	"agencyCode",
	// 	"sampleDate"
	// ]

	// QIDs_AllHandledByHand = this.QIDs_stationBasics;


	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Event Summary");
		const { eventID } = this.props.match.params;
		this.state = {
			event: getEventFromID(eventID),
			questionsData: getQuestionsData(eventID)
		}
	}


	buildDataEntryPanel(eventID, DE_QID) {
		let DEpanel = {};
		let questionData = getQuestionDataFromID(DE_QID);
		let questionValue = getQuestionValue(eventID, DE_QID);
		if(!questionData) {
			console.error("No question found for questionID '" + DE_QID + "' in event Data Entry summary");
			return;
		}

		console.log(questionData);
		console.log('questionValue :', questionValue);

		return DEpanel;
	}

	render() {
		const { event, questionsData } = this.state;
		const { eventID } = this.props.match.params;

		if (!event) {
			alert("Event ID, '" + eventID + "', did not match any events.  Redirecting to dashboard..");
			return <Redirect to='/' />
		}
		if (!questionsData) {
			console.error("Event ID, '" + eventID + "', did not match any questionsData.  Redirecting to dashboard..");
			return <Redirect to='/' />
		}


		let FFSummary = {};

		Object.keys(event.questionsValues).forEach(QID => {
			let questionData = getQuestionDataFromID(QID); // TODO: this should involve eventID
			if(!questionData) {
				console.error("No question data found for questionID '" + QID + "' in event summary.");
				return;
			}

			if (QID.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER)) {
				this.buildDataEntryPanel(eventID, QID);



			} else if (QID.startsWith(QWDATA_TABLE_IDENTIFIER)) {
				return;
			} else if (QID.startsWith(PARAMETERS_TABLE_IDENTIFIER)) {
				// this is harder, ignore and come back //TODO:
				return;
			} else {
				let labelValuePair = <Fragment key={"SummaryLabelValuePair_" + QID}>
					<Typography display="inline" className="summaryLabel">{questionData.label}</Typography> :
					<Typography display="inline" className="summaryValue">{event.questionsValues[QID]}</Typography>
					<br />
				</Fragment>

				if (!FFSummary[questionData.layoutGroup]) {
					FFSummary[questionData.layoutGroup] = [labelValuePair]
				} else {
					FFSummary[questionData.layoutGroup].push(labelValuePair)
				}
			}
		})
		// .filter(el => typeof el !== 'undefined');

		// ////////////////// FIELD FORM information Summary //////////////////

		// let FFQuestionsData = getTabQuestionsData(questionsData, "FIELDFORM");
		// let layoutGroupNames = getLayoutGroupNames(FFQuestionsData);

		// let FFSummary = layoutGroupNames.map((layoutName, index) => { // yes, this means we run through this more than needed, but this isn't a often-repeated process
		// 	let FFLGQD = getLayoutGroupQuestionsData(FFQuestionsData, layoutName);

		// 	let layoutGroupSummary = Object.values(FFLGQD).map(question => {

		// 			let value = getQuestionValue(eventID, question.id);
		// 			if (value) {
		// 				return <Fragment key={question.id}>
		// 					<b><Typography display="inline" className="summaryLabel">{question.label}</Typography> : </b>
		// 					<Typography display="inline" className="summaryValue">{value}</Typography>
		// 					<br />
		// 				</Fragment>
		// 			}
		// 	}).filter(el => typeof el !== 'undefined');

		// 	if (layoutGroupSummary.length < 1) {
		// 		return;
		// 	}

		// 	return <Fragment key={'SummaryKey' + layoutName}>
		// 		{index !== 0 ? <hr /> : null}
		// 		<Typography className="summaryLayoutHeader">{layoutName}</Typography>
		// 		{layoutGroupSummary}
		// 	</Fragment>
		// });


		// ////////////////// DATA ENTRY information Summary //////////////////

		// let DESummary = Object.keys(SEDIMENT_TYPES).map(sedType => {
		// 	// if we didn't do this sediment type, skip it

		// 	// this is a valid sediment type based on current values on the FF page
		// 	let DEQuestionsData = getTabQuestionsData(questionsData, "DATAENTRY");
		// 	console.log('questionsData :', questionsData);
		// 	console.log('DEQuestionsData :', DEQuestionsData);




		// }).filter(el => typeof el !== 'undefined'); // end sedType loop




		// let QWDATASummary =
		// 	Let ParametersSummary = 


		return (
			<React.Fragment>
				{Object.keys(FFSummary).map((layoutGroupName, index) => {
					return (
						<Fragment key={'SummaryKey' + layoutGroupName}>
							{index !== 0 ? <hr /> : null}
							<Typography className="summaryLayoutHeader">{layoutGroupName}</Typography>
							{FFSummary[layoutGroupName]}
						</Fragment>
					)
				})}
				<hr />
				<hr />
				<hr />
				<hr />
				{/* {DESummary} */}
			</React.Fragment>
		);

		// if(question.id.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER) ||
		// question.id.startsWith(QWDATA_TABLE_IDENTIFIER) ||
		// question.id.startsWith(PARAMETERS_TABLE_IDENTIFIER)) {
		// 	// this is harder, ignore and come back //TODO:
		// } else {
		// 	return <Typography>{question.id}</Typography>
		// }


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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(EventSummary));