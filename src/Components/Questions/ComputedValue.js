import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getQuestionDataFromLSbyQuestionID } from '../../Utils/QuestionUtilities';

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
	// warning, this does calculations based on LS
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
		console.log("handleVAlueChange");
		this.setState({
			value: event.target.value
		}, () => {
			this.props.stateChangeHandler(this)
		}
		);
	};

	componentWillUpdate(nextProps, nextState) { //performance - could add shouldcomponentupdate
		// console.log("CV: CWU: this.state:" , this.state);
		// console.log("CV: CWU: nextState:" , nextState);
		let curValue = this.computeValue(false)
		// console.log("CV: CWU: curValue:" , curValue);
		if(curValue!==nextState.value) {
			this.computeValue(true);
		}
	  }

	computeValue(updateState) {
		//computes value from computationString based on values in LS and optionally updates state and LS
		let DEBUG = false;
		if (DEBUG) console.log("computeValue: computationString: ", this.props.computationString);

		let computedValue = "";
		let shouldCompute = true;

		// if(this.props.id === "samplingWidth") {
		// 	DEBUG = true;
		// }

		// split the computation string into constituent components
		//TODO: remove spaces
		let splitCS = this.props.computationString.split(/([+,\-,*,/,(,),^])/g);
		if (DEBUG) console.log("computedValue: splitCS: ", splitCS);

		

		// replace all instaces of questionID's with their value
		for (let i = 0; i < splitCS.length; i++) {
			//if(DEBUG) console.log(splitCS[i] + " is a " + !) + " number");

			if (splitCS[i] !== '+' && splitCS[i] !== '-' && splitCS[i] !== '*' && splitCS[i] !== '/' &&
				splitCS[i] !== '(' && splitCS[i] !== ')' && splitCS[i] !== '^' && splitCS[i] !== "" 
				&& isNaN(splitCS[i])) {
				// splitCS[i] is a questionID
				let Q = getQuestionDataFromLSbyQuestionID(splitCS[i]);
				
				// check that all values returned without fail
				if(Q===null) {
					//TODO: Throw error
					if (DEBUG) console.log(splitCS[i] + " question was not found in LS");
					shouldCompute = false;
				} else if(Q.value==="") {
					//TODO: Throw error
					if (DEBUG) console.log(splitCS[i] + " question has null value in LS");
					shouldCompute = false;
				} else { //TODO: Check if number?
					splitCS[i] = Q.value;
				}
			}
		}
		if (DEBUG) console.log(splitCS);

		//TODO: save old splitCS values so we know what was null for better error display
		
		if (shouldCompute) {
			// rejoin string and send to math utility
			let finalComputeString = splitCS.join('')
			//console.log(finalComputeString);
			// set result to this value
			computedValue = math.eval(finalComputeString);
		}

		
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
		//console.log("CV render");

		// this.computeValue(true);
		

		//TODO: performance should probably make it so this doesn't run unless questionData updates
		//TODO: going to need to find a way to set the state.value so it can be referenced in other places similarly to other questions


		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
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
			xmlvalue={this.props.XMLValue}
			inputProps={{
				size: thisSize,
				readOnly: true
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
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['ComputedValue']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(ComputedValue);