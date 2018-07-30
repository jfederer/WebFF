import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import QuestionPanel from './QuestionPanel';
import { createQuestionComponentsForLayoutGroup, saveQuestionValueToLS,
	getLayoutGroupNames, getLayoutGroupQuestionsData } from '../Utils/QuestionUtilities';


// standardize (library?) the use of "questionsData" string to generalized variable

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});



class QuestionPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questionsData: this.props.questionsData,
			tabName: this.props.location.pathname.slice(1),
			hiddenPanels: this.props.hiddenPanels
		};
		this.questionChangeHandler = this.questionChangeHandler.bind(this);
	}

	componentDidMount() {

	}

	componentWillMount() {
		this.props.appBarTextCB(this.props.tabName);
	}

	componentWillUpdate(nextProps, nextState) { // gets called when moving between pages
		// console.log("QP: CWU: NextState", nextState);
		// console.log("QP: CWU: NextProps", nextProps);
		//REFACTOR 7/28 localStorage.setItem('questionsData', JSON.stringify(nextState.questionsData));
		this.props.appBarTextCB(nextProps.tabName);
	}

	questionChangeHandler(Q) {
		console.log("QuestionPage: questionChangeHandler: Q: ", Q);
		console.log("Q.state.value: ", Q.state.value);
		this.props.systemCB(Q); // check if there are additional actions needed based on the actionOptions in this question, Q  (FIX: and updated parent state?)
		saveQuestionValueToLS(Q);  //this function saves updated question "values" (must be located at "Q.state.value") to localStorage
	}



	render() {
		const DEBUG = false;
		const { tabName } = this.props;
		const { questionsData, hiddenQuestions } = this.state;
		let tabQuestionData = [];
		let layoutGroupNames = [];
		let questionPanels = [];
		if (DEBUG) console.log("Question Page Render:  state:  ", this.state);
		if (DEBUG) console.log("Question Page Render:  hiddenQuestions:  ", hiddenQuestions);


		if (questionsData.length > 0) {

			tabQuestionData = questionsData.filter((question) => {
				if(question.tabName) {
					return question.tabName.replace(/ /g,'') === tabName.replace(/ /g,'');  //regex removes whitespace... allowing a match regardless of whitespace in the url or the questions database
				} else {
					return null;
				}
			});

			layoutGroupNames = getLayoutGroupNames(tabQuestionData);
	
			layoutGroupNames = layoutGroupNames.filter((groupName) => {
				return !this.state.hiddenPanels.includes(this.state.tabName+":"+groupName); 
			})
				
			for(let i = 0; layoutGroupNames !== null && i < layoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionData, layoutGroupNames[i]);

				questionPanels.push(
				<div key={tabName + layoutGroupNames[i] + '_div'}>
					<QuestionPanel 
						questions={createQuestionComponentsForLayoutGroup(layoutGroupQuestionsData, this.questionChangeHandler, hiddenQuestions)} 
						panelName={layoutGroupNames[i]}
						key={tabName + layoutGroupNames[i]}
						grey={i%2===1} />
						<Divider />
						</div>
						);
			}
		}

		

		return (
			<div>
				{this.props.tabName}
				{questionPanels}
			</div>
		);
	}
}

QuestionPage.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func,
	tabName: PropTypes.string.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(QuestionPage));