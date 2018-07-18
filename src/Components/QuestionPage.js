import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import Question from './Question';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import QuestionPanel from './QuestionPanel';

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
			isLoading: true,
			questionsData: [],
			tabName: this.props.location.pathname.slice(1)
		};
		this.questionChangeHandler = this.questionChangeHandler.bind(this);
	}

	componentDidMount() {
		if (localStorage.getItem('questionsData')) {
			console.log("using local storage data for QP questions");
		} else {
			console.log("going to DB for data for navMenu");
			this.fetchData();
		}
	}

	componentWillMount() {
		this.props.appBarTextCB(this.props.tabName);
		if (localStorage.getItem('questionsData')) {
			this.setState({
				questionsData: JSON.parse(localStorage.getItem('questionsData')),
				isLoading: false
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('questionsData', JSON.stringify(nextState.questionsData));
		this.props.appBarTextCB(nextProps.tabName);
	}

	questionChangeHandler(Q) {
		//this function saves updated question "values" (must be located at "Q.value") to localStorage

		//FUTURE: while this works, it could be simpler re-written with spread operator

		//FUTURE: Should go to utility class or somewhere else that is parent of all pages

		var DEBUG = false;
		if (DEBUG) console.log(Q);
		if (Q == null) { //POC
			console.log("Question returned to questionChangeHandler was null");
			return;
		}

		if (DEBUG) console.log("--------------");
		if (DEBUG) console.log("FF state:");
		if (DEBUG) console.log(this.state);
		// to sync question modifications to localStorage
		if (DEBUG) console.log("--------------");
		if (DEBUG) console.log("Q:");
		if (DEBUG) console.log(Q.state);


		// get the questions in localStorage
		var rawData = JSON.parse(localStorage.getItem('questionsData'));
		if (DEBUG) console.log("--------------");
		if (DEBUG) console.log("questionsData");
		if (DEBUG) console.log(rawData);

		// find the specific question in questionData based on the key,then update the value property
		var QData = rawData.filter(questionData => {
			if (questionData.key === Q.state.key) {
				if (DEBUG) console.log("------FOUND!--------");
				if (DEBUG) console.log("questionData (pre)");
				if (DEBUG) console.log(questionData);
				if (DEBUG) console.log("Q.state.value");
				if (DEBUG) console.log(Q.state.value);
				//questionData.value="SEVEN!";
				questionData.value = Q.state.value;
				if (DEBUG) console.log("--------------");
				if (DEBUG) console.log("questionData (post)");
				if (DEBUG) console.log(questionData);
			}
			return questionData;
		});

		if (DEBUG) console.log(QData);

		// replace the questionData in localStorage
		localStorage.setItem('questionsData', JSON.stringify(rawData));
	}

	fetchData() {
		const DEBUG = false;
		const API = 'http://localhost:3004/';
		const query = 'questions';

		function handleErrors(response) {    // fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		}

		if (DEBUG) console.log("Function: fetchData @ " + API + query);
		fetch(API + query)
			.then(handleErrors)
			.then(response => response.json())
			.then(
				parsedJSON => {
					if (DEBUG) console.log("Parsed JSON: ");
					if (DEBUG) console.log(parsedJSON);
					//setTimeout(()=> {
					this.setState({
						questionsData: parsedJSON,
						isLoading: false
					});
					if (DEBUG) console.log("CurrentState: ");
					if (DEBUG) console.log(this.state);
					//},2000);
				})
			.catch(error => console.log("Error fetching " + API + query + "\n" + error));
	}

	createQuestionComponentsForLayoutGroup(questionsData) {
		// the questonisData variable contains only Questions data for this single layout group and returns question components pointing to this.questionChangeHandler
		let layoutGroupQuestionComponents = [];

		if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
			layoutGroupQuestionComponents = questionsData.map(questionData => <Question {...questionData} stateChangeHandler={this.questionChangeHandler} />);
		}

		return layoutGroupQuestionComponents;
	}

	getLayoutGroupNames(questionsData) {
		// provided with questionData, will return array of layout group names (strings)
		let layoutGroupNames = [];

		if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
			for (let i = 0; i < questionsData.length; i++) {
				if (!layoutGroupNames.includes(questionsData[i].layoutGroup)) {
					layoutGroupNames.push(questionsData[i].layoutGroup);
				}
			}
		}
		return layoutGroupNames;
	}

	getLayoutGroupQuestionsData(questionsData, layoutGroupName) {
		// given questionData, will filter down to items that match the layoutgroup = layoutGroupName
		let layoutGroupQuestionsData = [];

		if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
			layoutGroupQuestionsData = questionsData.filter((questionData) => {
				return questionData.layoutGroup === layoutGroupName;
			});
		}
		return layoutGroupQuestionsData;

	}


	render() {
		const DEBUG = false;
		const { classes, tabName } = this.props;
		const { isLoading, questionsData } = this.state;
		let tabQuestionData = [];
		let layoutGroupNames = [];
		let questionPanels = [];

		if (!isLoading && questionsData.length > 0) {

			tabQuestionData = questionsData.filter((question) => {
				return question.tabName.replace(/ /g,'') === tabName.replace(/ /g,'');  //regex removes whitespace... allowing a match regardless of whitespace in the url or the questions database
			});

			layoutGroupNames = this.getLayoutGroupNames(tabQuestionData);

			
			for(let i = 0; layoutGroupNames !== null && i < layoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = this.getLayoutGroupQuestionsData(tabQuestionData, layoutGroupNames[i]);

				questionPanels.push(
				<div key={tabName + layoutGroupNames[i] + '_div'}>
					<QuestionPanel 
						questions={this.createQuestionComponentsForLayoutGroup(layoutGroupQuestionsData)} 
						panelName={layoutGroupNames[i]}
						key={tabName + layoutGroupNames[i]}
						grey={i%2===1} />
						<Divider />
						</div>
						);
			}
		}

		if (DEBUG) console.log("render");
		if (DEBUG) console.log(this.state);

		return (
			<div>
				{this.props.tabName}
				{questionPanels}
				

				<hr /><hr /><hr />

				<p>When station name selected, auto populate:</p>
				<button onClick={() => this.props.navControl("EDI", true)}>Add EDI</button>
				<button onClick={() => this.props.navControl("EDI", false)}>Remove EDI</button>
				<button onClick={() => this.props.navControl("EWI", true)}>Add EWI</button>
				<button onClick={() => this.props.navControl("EWI", false)}>Remove EWI</button>

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