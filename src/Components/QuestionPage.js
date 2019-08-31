import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
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
import { QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION, IDENTIFIER_SPLITTER } from './../Constants/Config';


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
		const { tabName, currentEvent } = this.props;
		const { hiddenPanels } = this.props.UI.visibility;

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
			questionsData = getQuestionsData();
		}


		// let tabQuestionData = [];
		// let layoutGroupNames = [];
		let questionPanels = [];

		if (DEBUG) console.log("Question Page: Render: Page all Questions Data: ", questionsData);

		if (questionsData) {

			// Object.keys(questionsData).filter(key=> typeof key === "object");  // OPTIMIZE: (could likely remove, as items without tabName are filtered out elsewhere)

			let tabQuestionsData;
			if (this.props.questionsData) { //if questionsData is passed, use that and don't filter on tabName
				if (true) console.log("Question Page: Render: QD was passed, not filtering on TabName");
				tabQuestionsData = Object.values(this.props.questionsData);
				//if QD was passed, let's ensure unqiue panel names
				tabQuestionsData.forEach(question => {
					if (typeof question !== 'string' &&  question.id !== this.props.parentComponentNames[0]) {
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

			for (let i = 0; filteredLayoutGroupNames !== null && i < filteredLayoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionsData, filteredLayoutGroupNames[i]);

				questionPanels.push(
					<div key={tabName + filteredLayoutGroupNames[i] + '_div'}>
						<QuestionPanel
							questions={createQuestionComponents(layoutGroupQuestionsData, questionsValues, this.props.alternateChangeHandler)}
							panelName={filteredLayoutGroupNames[i].split(IDENTIFIER_SPLITTER)[0]}
							key={tabName + filteredLayoutGroupNames[i]}
							grey={i % 2 === 1} />
						<Divider />
					</div>
				);
			}


			return (
				<div>
					{this.props.tabName.split(IDENTIFIER_SPLITTER)[0]}
					{questionPanels}
				</div>
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
	return {
		// linkTables: state.LinkTables, // to get users event IDs
		// allSamplingEvents: state.SamplingEvents,
		//sedff: state.SedFF, // loading / fetching data
		// currentUser: state.Users[state.SedFF.currentUsername],
		//samplingEvents: state.SamplingEvents,
		UI: state.UI,
		// questionsData: state.Questions.questionsData,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
		// currentUser: state.User[state.SedFF.currentUsername]
	}
}

const mapDispatchToProps = {
	setAppBarText
}


export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(QuestionPage));