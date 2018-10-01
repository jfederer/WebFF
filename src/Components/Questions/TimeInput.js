import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

//this.state.value always contains the up-to-date time in this question

const styles = theme => ({
	timeInput: {
		margin: 0,
		fullWidth: true,
		wrap: 'nowrap',
		display: 'flex',
		flexWrap: 'wrap',
	},
});

class TimeInput extends React.Component {
	constructor(props) {
		let DEBUG = false;
		super(props);

		if (DEBUG) console.log("CONSTRUCTOR INSTRUCTOR DEDUCTOR");
		if (DEBUG) console.log("CONSTRUCTOR: Props.value: ", props.value);
		if (this.props.value != null) {
			if (DEBUG) console.log("CONSTRUCTOR: Props.value not equal null");
			this.state = {
				value: this.props.value
			};
		} else {
			if (DEBUG) console.log("CONSTRUCTOR: props.value equals null")
			let d = new Date();
			if (DEBUG) console.log("CONSTRUCTOR: Date: ", d)
			let hoursString = ('0' + d.getHours()).slice(-2);
			let minutesString = ('0' + (d.getMinutes())).slice(-2);
			let timeString = hoursString + ":" + minutesString;
			if (DEBUG) console.log("CONSTRUCTOR: timeString: ", timeString);
			this.state = {
				value: timeString
			}
			if (DEBUG) console.log("CONSTRUCTOR: state.value: ", this.state.value);
		}
	};

	componentWillMount() {
		//this.setState({ value: this.props.value });
	}

	handleValueChange = value => event => {
		// validate and format the input
		let newVal = event.target.value;
		newVal = newVal.replace(':', '');
		if (isNaN(newVal)) { // don't allow letters
			return;
		}

		if (newVal.length > 4) { // don't allow more than 4 characters
			return;
		}

		if (newVal.length === 2) {
			if (newVal > 24) {
				return;
			}
		}

		if (newVal.length === 4) {
			if (newVal.slice(0, 2) > 24) {
				return;
			}

			if (newVal.slice(2) > 59) {
				return;
			}
			newVal = newVal.slice(0, 2) + ":" + newVal.slice(2);
		}

		this.setState({
			value: newVal
		}, () => {
			this.props.stateChangeHandler(this)
		}
		);
	};

	render() {
		const { classes } = this.props;
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		// let thisSize = this.props.size ? this.props.size : 1;

		return <TextField className={classes.timeInput}
			id={this.props.id}
			key={this.props.id}
			label={this.props.label}
			fullWidth
			margin="none"
			type="text"
			value={this.props.value}
			xmltag={this.props.XMLTag}
			placeholder={'HHMM'}
			onChange={this.handleValueChange(this.props.id)}
			// style = {{width: 52, marginLeft:2}} //assign the width as your requirement
		/>
	}
}

TimeInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['TimeInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(TimeInput);