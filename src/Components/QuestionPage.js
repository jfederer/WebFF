import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { styles } from '../style';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';

import QuestionPanel from './QuestionPanel';
import {
	createQuestionComponents, getTabQuestionsData,
	getLayoutGroupNames, getLayoutGroupQuestionsData
} from '../Utils/QuestionUtilities';
import { getQuestionsData } from '../Utils/StoreUtilities';
import { setAppBarText } from '../Actions/UI';
import { IDENTIFIER_SPLITTER } from './../Constants/Config';


// standardize (library?) the use of "questionsData" string to generalized variable

// const styles = theme => ({
// 	root: {
// 		display: 'flex',
// 		flexWrap: 'wrap',
// 	},
// 	formControl: {
// 		margin: theme.spacing.unit,
// 		minWidth: 120,
// 	},
// 	selectEmpty: {
// 		marginTop: theme.spacing.unit * 2,
// 	},
// });



class QuestionPage extends React.Component {

	// componentWillMount() {
	// 	this.props.setAppBarText("SedFF → " + this.props.tabName);
	// }

	// componentWillUpdate(nextProps, nextState) { // gets called when moving between pages
	// 	console.log("eh?");
	// 	// this.props.appBarTextCB(nextProps.tabName);
	// }



	render() {
		const DEBUG = false;
		const { tabName, currentEvent, currentSamplingEventID, hiddenPanels, customOnly } = this.props;

		if (DEBUG) console.log("Question Page: Render:  props:  ", this.props);
		// if (DEBUG) console.log("Question Page Render:  hiddenPanels:  ", hiddenPanels);

		let questionsValues = currentEvent.questionsValues
		if (DEBUG) console.log("Question Page: Render: init QV: ", questionsValues);
		if (this.props.parentComponentNames) {
			questionsValues = questionsValues[this.props.parentComponentNames]; //TODO: make parentComponentNames an array
		}
		if (DEBUG) console.log("Question Page: Render: parent? QV: ", questionsValues);


		let questionsData;   //if questionsData is passed, use that and don't filter on tabName
		if (this.props.questionsData) {
			questionsData = Object.values(this.props.questionsData);
		} else {
			questionsData = getQuestionsData(currentSamplingEventID);
		}


		// let tabQuestionData = []; 
		// let layoutGroupNames = [];
		let questionPanels = [];

		if (DEBUG) console.log("Question Page: Render: Page all Questions Data: ", questionsData);

		if (questionsData) {
			// if this is a custom-only page, filter out all non-custom questions
			if (customOnly) {
				Object.keys(questionsData).forEach(key => {
					if (!key.startsWith("#")) {
						delete questionsData[key];
					}
				})
			}
			


			// Object.keys(questionsData).filter(key=> typeof key === "object");  // OPTIMIZE: (could likely remove, as items without tabName are filtered out elsewhere)

			let tabQuestionsData;
			if (this.props.questionsData) { //if questionsData is passed, use that and don't filter on tabName
				if (DEBUG) console.log("Question Page: Render: QD was passed, not filtering on TabName");
				tabQuestionsData = Object.values(this.props.questionsData);
				//if QD was passed, let's ensure unqiue panel names
				tabQuestionsData.forEach(question => {
					if (typeof question !== 'string' && question.id !== this.props.parentComponentNames[0]) {
						question.layoutGroup = question.layoutGroup + IDENTIFIER_SPLITTER + this.props.parentComponentNames[0]
					}
				}
				)
			} else {
				if (DEBUG) console.log("Question Page: Render: filtering on ", tabName);
				tabQuestionsData = getTabQuestionsData(questionsData, tabName);
			}

			if (DEBUG) console.log("Question Page: Render: Post Tab Filtering (all Q's that belong on tab): ", tabQuestionsData);

			let layoutGroupNames = getLayoutGroupNames(tabQuestionsData);
			if (DEBUG) console.log("Question Page: Render: RAW LAYOUT GROUP NAMES (all names of layout groups): ", layoutGroupNames);


			//OPTIMIZE: filter whitespaces at a higher level
			//OPTIMIZE: can we not generate question panels more clearly and efficiently than this.
			let filteredLayoutGroupNames = layoutGroupNames.filter((groupName) => {
				if (!groupName) {
					return false;
				}
				let panelName = tabName.replace(/ /g, '') + ":" + groupName.replace(/ /g, '');
				let keepPanel = !hiddenPanels.includes(panelName)
				if (DEBUG) console.log("Question Page: Render: filtering panelName against hidden list, keep '" + panelName + "'? -- ", keepPanel);

				return keepPanel;
			})

			let opts = { props: { sedimentType: this.props.sedimentType, samplingMethod: this.props.samplingMethod } };



			for (let i = 0; filteredLayoutGroupNames !== null && i < filteredLayoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionsData, filteredLayoutGroupNames[i]);

				questionPanels.push(
					<div key={tabName + filteredLayoutGroupNames[i] + '_div'}>
						<QuestionPanel
							questions={createQuestionComponents(layoutGroupQuestionsData, questionsValues, this.props.alternateChangeHandler, opts)}
							panelName={filteredLayoutGroupNames[i].split(IDENTIFIER_SPLITTER)[0]}
							key={tabName + filteredLayoutGroupNames[i]}
							grey={i % 2 === 1} />
						<Divider />
					</div>
				);
			}

			return (
				<React.Fragment>
					{questionPanels.length > 0   //If no question panels exist, let's just have this return nothing...
						? this.props.tabName.split(IDENTIFIER_SPLITTER)[0]
						: null}
					{questionPanels}
				</React.Fragment>
			);
		} else {
			return <div>ERROR: Question Data Not Loaded</div>
		}

	}
}

QuestionPage.propTypes = {
	classes: PropTypes.object.isRequired,
	tabName: PropTypes.string.isRequired,
};

const mapStateToProps = function (state) {

	// let stnName = state.SamplingEvents[state.SedFF.currentSamplingEventID].questionValues.stationName
	// let stn = "";
	// Object.keys(state.Stations).f

	return {
		// linkTables: state.LinkTables, // to get users event IDs
		// allSamplingEvents: state.SamplingEvents,
		//sedff: state.SedFF, // loading / fetching data
		// currentUser: state.Users[state.SedFF.currentUsername],
		//samplingEvents: state.SamplingEvents,
		hiddenPanels: state.UI.visibility.hiddenPanels,
		// questionsData: state.Questions.questionsData,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		currentSamplingEventID: state.SedFF.currentSamplingEventID,

		//unused, just here to trigger re-renders
		TRIGGER_questionsData: state.Questions.questionsData,
		TRIGGER_userQuestionsData: state.Users[state.SedFF.currentUsername].settings.questionsData,
		TRIGGER_eventQuestionsData: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsData,
		// TRIGGER_stationQuestionsData: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionValues.stationName,

	}
}

const mapDispatchToProps = {
	setAppBarText
}


export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(QuestionPage));