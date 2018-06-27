import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Question from './Question';

class FieldForm extends React.Component {
	constructor(props) {
		super(props);
			this.state = {
			  questionsData: [],
			};
	}

	componentWillMount() {
const API = 'http://localhost:3004/';
		fetch(API + 'questions') 
		.then(results => results.json())
		.then(data => this.setState({questionsData:data}))
	}

	componentDidMount() {
		this.props.appBarTextCB("Field Form");
	}

	render() {
		const { classes } = this.props;

		//create form questions
		var questionList = [];
		questionList.push(this.state.questionsData.map(questionData => {
			return <Question {...questionData} />
		}));


		return (
			<div>
				<h1>FF</h1>

				<form className={classes.root} autoComplete="off">
					{questionList}

				</form>
			</div>
		);
	}
}

FieldForm.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(FieldForm);