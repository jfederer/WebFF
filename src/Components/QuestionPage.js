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

		saveQuestionValueToLS(Q);  //this function saves updated question "values" (must be located at "Q.value") to localStorage
		this.props.systemCB(Q);
	}

	fetchData() {   //TODO:  Move to WebFF to ensure everything gets loaded before heading to field
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

	render() {
		const DEBUG = false;
		const { tabName } = this.props;
		const { isLoading, questionsData } = this.state;
		let tabQuestionData = [];
		let layoutGroupNames = [];
		let questionPanels = [];

		if (!isLoading && questionsData.length > 0) {

			tabQuestionData = questionsData.filter((question) => {
				if(question.tabName) {
					return question.tabName.replace(/ /g,'') === tabName.replace(/ /g,'');  //regex removes whitespace... allowing a match regardless of whitespace in the url or the questions database
				} else {
					return null;
				}
			});

			layoutGroupNames = getLayoutGroupNames(tabQuestionData);

			
			for(let i = 0; layoutGroupNames !== null && i < layoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionData, layoutGroupNames[i]);

				questionPanels.push(
				<div key={tabName + layoutGroupNames[i] + '_div'}>
					<QuestionPanel 
						questions={createQuestionComponentsForLayoutGroup(layoutGroupQuestionsData, this.questionChangeHandler)} 
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