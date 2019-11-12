import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents'
import _ from 'lodash';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
const math = require('mathjs');

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: 1,
		marginRight: 1,
	},
});

class ComputedValue extends React.Component {

	componentWillMount() {
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, this.computeValue(this.props));
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, this.computeValue(this.props));
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (!_.isEqual(this.props.currentEventQuestionsValues, nextProps.currentEventQuestionsValues)) {  //OPTIMIZE: get list of questions from compute string, store in state, and only check those for changes.
			// if props changed... recompute value
			let computedValue = this.computeValue(nextProps);
			if (nextProps.currentEventQuestionsValues[this.props.id] !== computedValue) {
				// if newly computed value should result in value change, send off action
				if (this.props.alternateChangeHandler) {
					this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, computedValue);
				} else {
					this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, computedValue);
				}
			}
		}
	}


	computeValue(args) {
		//computes value from computationString
		//@para: args is props (either next or current can be used) and must include currentEventID, defaultQuestionsData, currentEventQuestionsValues, computationString
		//@returns: computed value if all questions in computationString are valid and have values... otherwise, returns empty string.
		const { currentEventID, defaultQuestionsData, currentEventQuestionsValues, computationString } = args;

		if (!currentEventID) {
			//TODO: error
			console.log("currentEventID not set in computeValue function in ComputedValue component");
		}
		if (!defaultQuestionsData) {
			//TODO: error
			console.log("defaultQuestionsData not set in computeValue function in ComputedValue component");
		}
		if (!currentEventQuestionsValues) {
			//TODO: error
			console.log("currentEventQuestionsValues not set in computeValue function in ComputedValue component");
		}
		if (!computationString) {
			//TODO: error
			console.log("computationString not set in computeValue function in ComputedValue component");
		}

		if (Array.isArray(computationString)) {  // at this time, arrays passed as computation strings are just pass-through to getQuestionValue - no computation is preformed
			//TODO: error
			return getQuestionValue(this.props.currentEventID, ...computationString);
		}
		

		let DEBUG = false;
		if (DEBUG) console.log("--------------------------------");
		if (DEBUG) console.log("computeValue: computationString: ", computationString);

		let computedValue = "";
		// let shouldCompute = true;

		// remove whitespace and split the computation string into constituent components
		let splitCS = computationString.replace(/ /g, '').split(/([+,\-,*,/,(,),^])/g);

		if (DEBUG) console.log("SPLIT PRE:", splitCS);
		// replace all instances of questionID's with their value
		for (let i = 0; i < splitCS.length; i++) {
			if (DEBUG) console.log("Working with item: ", splitCS[i]);

			if ((['+', "-", '*', '/', '(', ')', '^'].indexOf(splitCS[i]) < 0) && isNaN(splitCS[i])) {
				if (DEBUG) console.log(splitCS[i] + " is a question!");
				// splitCS[i] is a questionID
				let q_id = splitCS[i];
				let q_val;


				if (defaultQuestionsData[q_id]) {
					if (DEBUG) console.log("question found in default");
					q_val = defaultQuestionsData[q_id].value;

					if (currentEventQuestionsValues[q_id]) {
						if (DEBUG) console.log("question found in current event values");
						q_val = currentEventQuestionsValues[q_id];
					}
				} else {
					if (DEBUG) console.log(q_id + " question was not found");
					//TODO: THROW ERROR for not finding in defaultQuestionsData
					return "";
				}



				// check that value returned and that it was a number...
				if (!q_val || isNaN(q_val)) {
					if (DEBUG) console.log("question came back as null or NaN"); // all need to come back as valid or the computation fails
					return "";
				} else {
					splitCS[i] = q_val;
				}
			}
		}

		if (DEBUG) console.log("SPLIT POST: ", splitCS);

		//TODO: save old splitCS values so we know what was null for better error display

		if (splitCS.length === 1) {   //TODO: test why this extra If level is needed.  what fails that reqiures this?
			computedValue = splitCS[0];
		} else {
			// rejoin string and send to math utility
			let finalComputeString = splitCS.join('')
			computedValue = math.eval(finalComputeString);
		}

		return computedValue;
	}

	render() {
		// const { classes, currentEventQuestionsValues, currentEventID, id } = this.props;
		const { classes } = this.props;

		//TODO: performance should probably make it so this doesn't run unless questionData updates

		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		//TODO: generate minimum size
		let thisSize = this.props.size ? this.props.size : 1;
		let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.computationString;

		return <TextField
			value={this.props.value ? this.props.value : ""}
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			placeholder={realPlaceholder}
			className={classes.textField}
			fullWidth
			xmltag={this.props.XMLTag}
			inputProps={{
				size: thisSize,
				readOnly: [this.props.readOnly]
			}}
		/>;

	}
}

ComputedValue.propTypes = {
	computationString: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.array.isRequired
	]),
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['ComputedValue']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEventQuestionsValues: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsValues,
		defaultQuestionsData: state.Questions.questionsData
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ComputedValue));