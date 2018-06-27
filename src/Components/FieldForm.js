import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Question from './Question';

class FieldForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			questionsData: [],
		};
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
		console.log("CWU");
			localStorage.setItem('questionsData',JSON.stringify(nextState.questionsData));
			console.log()
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
			questionList.push(questionsData.map(questionData => <Question {...questionData} />));
		}
		if(DEBUG)console.log("render");
		if(DEBUG)console.log(this.state);
		

		//TODO: loader is not working.  Likely css problem.  Look at ihatetomatoes css stuff. 
		return (
			<div>    
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