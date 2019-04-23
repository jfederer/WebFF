import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { styles } from '../style';
import { withStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';

import QuestionPanel from './QuestionPanel';
import {
	createQuestionComponents, getTabQuestionsData, 
	getLayoutGroupNames, getLayoutGroupQuestionsData
} from '../Utils/QuestionUtilities';
import { setAppBarText } from '../Actions/UI';


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

	componentWillMount() {
		this.props.setAppBarText("SedFF → " + this.props.tabName);
	}

	// componentWillUpdate(nextProps, nextState) { // gets called when moving between pages
	// 	this.props.appBarTextCB(nextProps.tabName);
	// }

	render() {
		const DEBUG = false;
		const { tabName, currentEvent } = this.props;
		const { hiddenPanels, questionsData } = this.props.questions;
		// let tabQuestionData = [];
		// let layoutGroupNames = [];
		let questionPanels = [];
		if (DEBUG) console.log("Question Page Render:  props:  ", this.props);
		if (DEBUG) console.log("Question Page Render:  hiddenPanels:  ", hiddenPanels);


		//OPTIMIZE: filter whitespaces at a higher level

		if (questionsData) {
			let tabQuestionsData = getTabQuestionsData(questionsData, tabName);
			console.log("TAB QUESTION DATA: ", tabQuestionsData);
			let layoutGroupNames = getLayoutGroupNames(tabQuestionsData);

			console.log("RAW LAYOUT GROUP NAMES: ", layoutGroupNames);

			let filteredlayoutGroupNames = layoutGroupNames.filter((groupName) => {
				let panelName = tabName.replace(/ /g, '') + ":" + groupName.replace(/ /g, '');
				return !hiddenPanels.includes(panelName);
			})

			console.log("FILTERED LAYOUT GROUP NAMES: ", filteredlayoutGroupNames);

			for(let i = 0; filteredlayoutGroupNames !== null && i < filteredlayoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionsData, filteredlayoutGroupNames[i]);

				questionPanels.push(
				<div key={tabName + filteredlayoutGroupNames[i] + '_div'}>
					<QuestionPanel 
						questions={createQuestionComponents(layoutGroupQuestionsData, currentEvent.questionValues)} 
						panelName={filteredlayoutGroupNames[i]}
						key={tabName + filteredlayoutGroupNames[i]}
						grey={i%2===1} />
						<Divider />
						</div>
						);
			}


			return (
				<div>
					QUESTION PAGE!
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
		questions: state.Questions,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText
}


export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(QuestionPage));