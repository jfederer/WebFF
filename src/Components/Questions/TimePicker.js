import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { TextField} from '@material-ui/core';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents'
import { getTimeStringFromDate } from '../../Utils/Utilities';

const styles = theme => ({
	timeInput: {
		margin: 0,
		fullWidth: true,
		wrap: 'nowrap',
		display: 'flex',
		flexWrap: 'wrap',
	},
});

class TimePicker extends React.Component {
	constructor(props) {
		super(props);

		if (!this.props.value && this.props.autofill) { // no value and set to autofill... fill with current time
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, getTimeStringFromDate());
		} 
	};

	componentWillMount() {

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

		this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, newVal);
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
			value={this.props.value?this.props.value:""}
			xmltag={this.props.XMLTag}
			placeholder={'HH:MM'}
			onChange={this.handleValueChange(this.props.id)}
			// style = {{width: 52, marginLeft:2}} //assign the width as your requirement
		/>




	}
}

TimePicker.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['TimeInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(TimePicker));
