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
		
		var rawData = JSON.parse(localStorage.getItem('questionsData'));
		console.log("--------------");
		console.log("questionsData");
		console.log(rawData);

		// var QD = rawData.filter(questionData => {
		// 	if (questionData.key===Q.state.key) {
		// 		console.log("--------------");
		// 		console.log("questionData (pre)");
		// 		console.log(questionData);
		// 		questionData.value = Q.value;
		// 		console.log("--------------");
		// 		console.log("questionData (post)");
		// 		console.log(questionData);
				
		// 	}
		// 	return questionData;
		// });

		//this.setState({"questionsData":QD});

		// if(theQ && theQ.length !== 1) {
		// 	//TODO: throw error -- should only return one thing with unqiue key..
		// } else {
		// 	theQ = theQ[0];
		// }
		
		// console.log(theQ);

		// theQ.value = Q.state.value;
		// console.log(theQ);
		// var test1 = JSON.parse(rawData).filter((item) => {
		// 	if (item.key==='test4')
		// 	return item;
		// });
		// console.log(test1);
		// test1[0].id="TEST4";
		
		//console.log(test1);

		//console.log(this.find_in_object(rawData, {key:'test1'}));

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