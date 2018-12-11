import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const math = require('mathjs');

//this.state.value always contains the up-to-date question values/answers.

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
});

class ComputedValue extends React.Component {
	// TODO: probably better to pass state and/or use the call back somehow... but utility functions meet the need.
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value,
		};
	};

	componentWillMount() {
		this.computeValue(true);
	}

	handleValueChange = value => event => {
		this.setState({
			value: event.target.value
		}, () => {
			this.props.stateChangeHandler(this)
		}
		);
	};

	componentWillUpdate(nextProps, nextState) { 
		 let curValue = this.computeValue(false) // this runs twice to avoid triggering 
		 if (curValue !== nextState.value) {
			this.computeValue(true);
		 }
	}

	computeValue(updateState) {
		//console.log("CV");
		//computes value from computationString based on values in LS and optionally updates state and LS
		let DEBUG = false;
		if (DEBUG) console.log("computeValue: computationString: ", this.props.computationString);
		if(this.props.questionsValues===null) {
			return;
		}
		let computedValue = "";
		let shouldCompute = true;

		if (DEBUG) console.log("--------------------------------");
		//if(this.props.globalState);

		// if(this.props.id === "samplingWidth") {
		// 	DEBUG = true;
		// }

		// split the computation string into constituent components
		//TODO: remove spaces
		let splitCS = this.props.computationString.replace(/ /g, '').split(/([+,\-,*,/,(,),^])/g);
		//let splitCS = this.props.computationString.split(/([+,\-,*,/,(,),^])/g);
		if (DEBUG) console.log("computedValue: splitCS: ", splitCS);


		if (DEBUG) console.log("SPLIT PRE:", splitCS);
		// replace all instances of questionID's with their value
		for (let i = 0; i < splitCS.length; i++) {
			if (DEBUG) console.log("Working with item: ", splitCS[i]);
			

			if (!(splitCS[i] === '+' || splitCS[i] === '-' || splitCS[i] === '*' || splitCS[i] === '/' ||
				splitCS[i] === '(' || splitCS[i] === ')' || splitCS[i] === '^' || splitCS[i] === "" ||
				splitCS[i] === null) && isNaN(splitCS[i])) {
				if (DEBUG) console.log(splitCS[i] + " is a question!");
				// splitCS[i] is a questionID
				let q_id = splitCS[i];
				let q_val = this.props.questionsValues[splitCS[i]];
				//let Q = getQuestionDataFromQuestionsDataByQuestionID(this.props.globalState.questionsData, splitCS[i]); //TODO: switch to get questionValue
				// if (DEBUG) console.log("subQuestion Q: ", Q);

				// check that all values returned without fail
				if (q_val === null || q_val === "") {
					if (DEBUG) console.log(q_id + " question was not found");
					shouldCompute = false;
				} else { //TODO: Check if number?
					splitCS[i] = q_val;
				}
			}
		}
		if (DEBUG) console.log("SPLIT POST: ", splitCS);

		//TODO: save old splitCS values so we know what was null for better error display

		if (shouldCompute && splitCS.length===1) {
			computedValue = splitCS[0];
		} else if(shouldCompute) {
			// rejoin string and send to math utility
			let finalComputeString = splitCS.join('')
			//console.log(finalComputeString);
			computedValue = math.eval(finalComputeString);
		}


		// set result to this value if we are suppose dto.
		if (updateState && this.state.value !== computedValue) {
			this.setState({
				value: computedValue
			}, () => {
				this.props.stateChangeHandler(this);
			}
			);
		}

		return computedValue;
	}

	render() {
		const { classes } = this.props;
		//TODO: performance should probably make it so this doesn't run unless questionData updates

		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		//TODO: generate minimum size
		let thisSize = this.props.size ? this.props.size : 1;
		let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.computationString;

		return <TextField
			value={this.state.value}
			onChange={this.handleValueChange(this.props.id)}
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
	computationString: PropTypes.string.isRequired,
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

export default withStyles(styles)(ComputedValue);