import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Question from './Question';

import Divider from '@material-ui/core/Divider';

// standardize (library?) the use of "questionsData" string to generalized variable

class FieldForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			questionsData: [],
		};
		this.questionChangeHandler = this.questionChangeHandler.bind(this);
	}

	componentDidMount() {
		if (localStorage.getItem('questionsData')) {
			console.log("using local storage data for FF questions");
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
		//console.log()
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


	createQuestionsForTab(questionsData) {
		// the questionsData variable contains only Questions for this single tab.
		const { classes } = this.props;
		//FUTURE: can absolutely be done more efficiently and with just a single recursive function.  So bad might even qualify as a FIXME: if there are performance issues


		let tabQuestions = [];

		//split questionsData into layoutGroups
		//--find all layout groups
		let layoutGroupNames = [];
		for (let i = 0; i < questionsData.length; i++) {
			if (!layoutGroupNames.includes(questionsData[i].layoutGroup)) {
				layoutGroupNames.push(questionsData[i].layoutGroup);
			}
		}

		//-- build layoutGroup questions
		for (let i = 0; i < layoutGroupNames.length; i++) {
			let layoutGroup = [];
			for (let k = 0; k < questionsData.length; k++) {
				if (questionsData[k].layoutGroup === layoutGroupNames[i]) {
					layoutGroup.push(questionsData[k]);
				}
			}
			if (i > 0) {
				let timestamp = new Date().getUTCMilliseconds();
				tabQuestions.push(<p>DIVIDER!!!!</p>);  //TODO: add divider between layoutGroups
			}
			tabQuestions.push(this.createQuestionsForLayoutGroup(layoutGroup));
			console.log("Layout Group " + layoutGroupNames[i]);
			console.log(layoutGroup);
		}



		console.log("Tab Questions Length: " + tabQuestions.length);
		for (let i = 0; i < questionsData.length; i++) {
			console.log(tabQuestions[i]);
		}
		return tabQuestions;
	}

	createQuestionsForLayoutGroup(questionsData) {
		// the questonisData variable contains only Questions data for this single layout group
		let layoutGroupQuestionList = [];
		if (questionsData.length > 0) {
			layoutGroupQuestionList = questionsData.map(questionData => <Question {...questionData} stateChangeHandler={this.questionChangeHandler} />);
		}
		return layoutGroupQuestionList;
	}

	render() {
		const DEBUG = false;
		const { classes } = this.props;
		const { isLoading, questionsData } = this.state;

		//create form questions
		var questionList = [];
		//console.log(this.props.tabName);
		let tempQ = questionsData.filter((question) => {
			return question.tabName === this.props.tabName;
		}
		)
		console.log("TempQ");
		console.log(tempQ);
		questionList = this.createQuestionsForTab(tempQ);

		// if (!isLoading && questionsData.length > 0) {
		// 	questionList.push(questionsData.map(questionData => <Question {...questionData} stateChangeHandler={this.questionChangeHandler} />));
		// }
		if (DEBUG) console.log("render");
		if (DEBUG) console.log(this.state);


		//TODO: loader is not working.  Likely css problem.  Look at ihatetomatoes css stuff. 
		return (
			<div>
				<p>Select station name (list pulled from DB --> based on previous entries rather than admin console?)</p>

				<p>When station name selected, auto populate:</p>
				<button onClick={() => this.props.navControl("EDI", true)}>Add EDI</button>
				<button onClick={() => this.props.navControl("EDI", false)}>Remove EDI</button>
				<button onClick={() => this.props.navControl("EWI", true)}>Add EWI</button>
				<button onClick={() => this.props.navControl("EWI", false)}>Remove EWI</button>

				<form className={classes.root} autoComplete="off">
					{
						!isLoading && questionList.length > 0 ? questionList : null
					}
				</form>
				<div className="loader">
					<div className="icon">LOADING!!!!</div>
				</div>
			</div>
		);
	}
}

FieldForm.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(FieldForm);