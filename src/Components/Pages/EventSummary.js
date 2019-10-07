import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import { getEventFromID, getQuestionsData } from '../../Utils/StoreUtilities';

import { setAppBarText } from '../../Actions/UI'; //TODO: we don't atually set appbar text
import { DATA_ENTRY_INFORMATION_IDENTIFIER, QWDATA_TABLE_IDENTIFIER, PARAMETERS_TABLE_IDENTIFIER } from '../../Constants/Config';
import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { getQuestionValue, getTabQuestionsData, getLayoutGroupNames } from '../../Utils/QuestionUtilities';


class EventSummary extends React.Component {


	QIDs_stationBasics = [
		"stationName",
		"stationNumber",
		"projectName",
		"projectID",
		"agencyCode",
		"sampleDate"
	]

	QIDs_AllHandledByHand = this.QIDs_stationBasics;


	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Event Summary");
		const { eventID } = this.props.match.params;
		this.state = {
			event: getEventFromID(eventID),
			questionsData: getQuestionsData(eventID)
		}
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


		//build station basics
		// let stationBasics = this.QIDs_stationBasics.map(qid => {
		// 	let question = questionsData[qid];
		// 	return <Fragment>
		// 		<b><Typography display="inline" className="summaryLabel">{question.label}</Typography> : </b>
		// 		<Typography display="inline" className="summaryValue">{getQuestionValue(eventID, question.id)}</Typography>
		// 		<br /> 
		// 	</Fragment>
		// })


		let tabQuestionsData = getTabQuestionsData(questionsData, "FIELDFORM");
		let layoutGroupNames = getLayoutGroupNames(tabQuestionsData);

		console.log('tabQuestionsData :', tabQuestionsData);
		console.log('layoutGroupNames :', layoutGroupNames);

		let FFSummary = layoutGroupNames.map((layoutName, index) => { // yes, this means we run through this more than needed, but this isn't a often-repeated process

			let layoutGroupSummary = Object.values(tabQuestionsData).map(question => {
				// if (this.QIDs_AllHandledByHand.includes(question.id)) {
				// 	return;
				// }
				if (question.layoutGroup === layoutName) {
					let value = getQuestionValue(eventID, question.id);
					if (value) {
						return <Fragment key={question.id}>
							<b><Typography display="inline" className="summaryLabel">{question.label}</Typography> : </b>
							<Typography display="inline" className="summaryValue">{value}</Typography>
							<br />
						</Fragment>
					}
				}
			}).filter(el => typeof el !== 'undefined');

			if (layoutGroupSummary.length < 1) {
				return;
			}

			return <Fragment key={'SummaryKey' + layoutName}>
				{index !== 0 ? <hr /> : null}
				<Typography className="summaryLayoutHeader">{layoutName}</Typography>
				{layoutGroupSummary}

			</Fragment>
		});

		// let DESummary = Object.values(questionsData).map(question => {
		// 	if (question.tabName && question.tabName.replace(/ /g, '').toUpperCase() === "DATAENTRY") {
		// 		let value = getQuestionValue(eventID, question.id);
		// 		if (value) {
		// 			return <Typography>{question.id} ----> {value}</Typography>
		// 		}
		// 	}
		// })

		// let QWDATASummary =
		// 	Let ParametersSummary = 


		return (
			<React.Fragment>
				{/* {stationBasics} */}
				{/* <hr /> */}
				{FFSummary}
				{/* <hr /> */}
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