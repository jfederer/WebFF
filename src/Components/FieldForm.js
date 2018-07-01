import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Question from './Question';

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
		if(localStorage.getItem('questionsData')) {
			console.log("using local storage data");
		} else {
			this.fetchData();
		}
	}

	componentWillMount() {
		this.props.appBarTextCB("Field Form");
		if (localStorage.getItem('questionsData')) {
			this.setState({
				questionsData: JSON.parse(localStorage.getItem('questionsData')),
				isLoading:false
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
			localStorage.setItem('questionsData',JSON.stringify(nextState.questionsData));
			//console.log()
		}


	questionChangeHandler(Q) {
		console.log("--------------");
		console.log("FF state:");
		console.log(this.state);
		// to sync question modifications to localStorage
		console.log("--------------");
		console.log("Q:");
		console.log(Q.state);

		
		// get the questions in localStorage
		var rawData = JSON.parse(localStorage.getItem('questionsData'));
		console.log("--------------");
		console.log("questionsData");
		console.log(rawData);

		// find the specific question in questionData based on the key,then update the value property
		var QD = rawData.filter(questionData => {
			if (questionData.key===Q.state.key) {
				console.log("------FOUND!--------");
				console.log("questionData (pre)");
				console.log(questionData);
				console.log("Q.state.value");
				console.log(Q.state.value);
				//questionData.value="SEVEN!";
				questionData.value = Q.state.value;
				console.log("--------------");
				console.log("questionData (post)");
				console.log(questionData);				
			}
			return questionData;
		});

		// replace the questionData in localStorage
		localStorage.setItem('questionsData', JSON.stringify(rawData));
		
		//FUTURE:  likely  way to do this without replacing the entire 'questionsData'.
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

		if(DEBUG)console.log("Function: fetchData @ " + API + query);
		fetch(API + query)
			.then(handleErrors)
			.then(response => response.json())
			.then(
				parsedJSON => {
					if(DEBUG)console.log("Parsed JSON: ");
					if(DEBUG)console.log(parsedJSON);
					//setTimeout(()=> {
						this.setState({ 
							questionsData: parsedJSON,
							isLoading:false});
						if(DEBUG)console.log("CurrentState: ");
						if(DEBUG)console.log(this.state);
					//},2000);
				})
				.catch(error => console.log("Error fetching " + API + query + "\n" + error));
	}



	render() {
		const DEBUG=false;
		const { classes } = this.props;
		const { isLoading, questionsData } = this.state;

		//create form questions
		var questionList = [];
		if(!isLoading && questionsData.length>0) {
			questionList.push(questionsData.map(questionData => <Question {...questionData} stateChangeHandler={this.questionChangeHandler} />));
		}
		if(DEBUG)console.log("render");
		if(DEBUG)console.log(this.state);
		

		//TODO: loader is not working.  Likely css problem.  Look at ihatetomatoes css stuff. 
		return (
			<div>
				<p>Select station name (list pulled from DB --> based on previous entries rather than admin console?)</p>
				
				<p>When station name selected, auto populate:</p>
				<ul>
					<li><b>Project name</b></li>
					<li><b>Project ID</b></li>
					<li><b>Station Number</b></li>
					<li><b>Agency Code</b></li>
					<li><b>Sample Data</b> (auto populated with current date)</li>
					<li><b>SSC Sample Type</b> (EDI or EWI:  If EDI selected, add EDI tab... If EWI selected, add EWI Tab)</li>
					<li><b>Bedload attempted?</b>  (opens new tab or questions on EDI/EWI tab... I forget, check notes)</li>
					<li><b>Bed Material attempted?</b> (opens new tab or questions on EDI/EWI tab... I forget, check notes)</li>
					<li><b>Time Zone</b></li>
					<li><b>Sample Team</b></li>
					<li><b>Compiled by</b></li>
					<li><b>Same day Sample</b></li>
				</ul>
				<p>Weather:</p>
				<ul>
					<li><b>Sky</b></li>
					<li><b>Precip</b></li>
					<li><b>Temp</b></li>
					<li><b>Wind</b></li>
					<li><b>Direction</b></li>
				</ul>

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