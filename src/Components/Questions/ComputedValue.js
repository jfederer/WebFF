import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getQuestionDataFromLSbyQuestionID, saveQuestionValueToLS } from '../../Utils/QuestionUtilities';
import { mathStringReformat } from '../../Utils/MathUtilities';

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
		this.setState({value:this.computeValue()}, this.props.stateChangeHandler(this));
	}

	handleValueChange = value => event => {  
		this.setState({
			value: event.target.value
		}, () => {
			this.props.stateChangeHandler(this)
		}
		);
	};

	componentWillUpdate() {
		console.log("Yep");
	}

	computeValue() {
		let DEBUG = false;
		if (DEBUG) console.log(this.props.computationString);

		let computedValue="";

		// split the computation string into constituent components
		let splitCS = this.props.computationString.split(/([+,-,*,/,(,),^])/g);
		if (DEBUG) console.log(splitCS);

		// replace all instaces of questionID's with their value
		for (let i = 0; i < splitCS.length; i++) {
			if (splitCS[i] !== '+' && splitCS[i] !== '-' && splitCS[i] !== '*' &&	splitCS[i] !== '/' &&
				splitCS[i] !== '(' && splitCS[i] !== ')' && splitCS[i] !=='^') {
					// splitCS[i] is a questionID
					let Q = getQuestionDataFromLSbyQuestionID(splitCS[i]); 
					console.log(Q);
					splitCS[i] = Q.value;
				}
		}
		if (DEBUG) console.log(splitCS);

		//TODO: save old splitCS values so we know what was null for better error display

		// check that all values returned without fail
		if(splitCS.includes("")) {
			console.log("null value was returned in ComputedValue question");
		} else {
			// rejoin string and send to math utility
			let finalComputeString = splitCS.join('')
			console.log(finalComputeString);
			// set result to this value
			computedValue = eval(finalComputeString);
		}

		return computedValue;
	}

	render() {
		const { classes } = this.props;
		console.log("CV render");
		
		
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