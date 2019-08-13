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
import { QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION } from './../Constants/Config';


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

		console.log("Question Page Render:  props:  ", this.props);
		console.log("Question Page Render:  props.currentEvent.questionsValues.DataEntry::Suspended:  ", JSON.stringify(this.props.currentEvent.questionsValues["DataEntry::Suspended"]));

		let questionsValues = currentEvent.questionsValues
		console.log("QP: init QV: ", questionsValues);
		if(this.props.parentComponentNames) {
			questionsValues = questionsValues[this.props.parentComponentNames]; //TODO: make parentComponentNames an array
		}
		console.log("QP: parent? QV: ", questionsValues);


		let questionsData;   //if questionsData is passed, use that and don't filter on tabName
		if (this.props.questionsData) {
			questionsData = Object.values(this.props.questionsData);
		} else {
			questionsData = getQuestionsData();
		}

		
		// let tabQuestionData = [];
		// let layoutGroupNames = [];
		let questionPanels = [];
		
		if (DEBUG) console.log("Question Page Render:  hiddenPanels:  ", hiddenPanels);


		if (questionsData) {

			Object.keys(questionsData).filter(key=> typeof key === "object");  // OPTIMIZE: (could likely remove, as items without tabName are filtered out elsewhere)

			let tabQuestionsData;
			if (this.props.questionsData) { //if questionsData is passed, use that and don't filter on tabName
				tabQuestionsData = Object.values(this.props.questionsData);
			} else {
				tabQuestionsData = getTabQuestionsData(questionsData, tabName);
			}
			
			if (DEBUG) console.log("TAB QUESTION DATA: ", tabQuestionsData);
			let layoutGroupNames = getLayoutGroupNames(tabQuestionsData);

			if (DEBUG) console.log("RAW LAYOUT GROUP NAMES: ", layoutGroupNames);


			//OPTIMIZE: filter whitespaces at a higher level
			//OPTIMIZE:  can we not generate question panels more clearly and efficiently than this.
			let filteredLayoutGroupNames = layoutGroupNames.filter((groupName) => {
				if (!groupName) {
					return false;
				}
				let panelName = tabName.replace(/ /g, '') + ":" + groupName.replace(/ /g, '');
				return !hiddenPanels.includes(panelName);
			})

			for (let i = 0; filteredLayoutGroupNames !== null && i < filteredLayoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionsData, filteredLayoutGroupNames[i]);

				questionPanels.push(
					<div key={tabName + filteredLayoutGroupNames[i] + '_div'}>
						<QuestionPanel
							questions={createQuestionComponents(layoutGroupQuestionsData, questionsValues, this.props.alternateChangeHandler)}
							panelName={filteredLayoutGroupNames[i]}
							key={tabName + filteredLayoutGroupNames[i]}
							grey={i % 2 === 1} />
						<Divider />
					</div>
				);
			}


			return (
				<div>
				 {this.props.tabName}
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