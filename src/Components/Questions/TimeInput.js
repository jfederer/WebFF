import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

//this.state.value always contains the up-to-date time in this question

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

class TimeInput extends React.Component {
	constructor(props) {
		let DEBUG=false;
		super(props);

		if(DEBUG)console.log("CONSTRUCTOR INSTRUCTOR DEDUCTOR");
		if(DEBUG)console.log("CONSTRUCTOR: Props.value: ", props.value);
		if (this.props.value != null) {
			if(DEBUG)console.log("CONSTRUCTOR: Props.value not equal null");
			this.state = {
				value: this.props.value
			};
		} else {
			if(DEBUG)console.log("CONSTRUCTOR: props.value equals null")
			let d = new Date();
			if(DEBUG)console.log("CONSTRUCTOR: Date: ", d)
			let hoursString = ('0' + d.getHours()).slice(-2);
			let minutesString = ('0' + (d.getMinutes()+1)).slice(-2);
			let timeString = hoursString + ":" + minutesString;
			if(DEBUG)console.log("CONSTRUCTOR: timeString: ", timeString);
			this.state = {
				value: timeString
			}
			if(DEBUG)console.log("CONSTRUCTOR: state.value: ", this.state.value);
		}
	};

	componentWillMount() {
		//this.setState({ value: this.props.value });
	}

	handleValueChange = value => event => {
		this.setState({
			value: event.target.value
		}, () => {
			console.log(this.props.stateChangeHandler);
			this.props.stateChangeHandler(this)
		}
		);
	};

	render() {
		const { classes } = this.props;
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
		// let thisSize = this.props.size ? this.props.size : 1;

		return <TextField
		id={this.props.id}
		key={this.props.id}
		label={this.props.label}
		fullWidth
        type="time"
		value={this.state.value}
		xmlvalue={this.props.XMLValue}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: this.props.step,
		}}
		onChange={this.handleValueChange(this.props.id)}
      />
	}
}

TimeInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['TimeInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(TimeInput);