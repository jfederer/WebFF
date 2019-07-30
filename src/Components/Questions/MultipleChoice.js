import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents'


const styles = theme => ({

});



class MultipleChoice extends React.Component {
	constructor(props) {
		super(props);
		
		if (this.isInvalid()) {

			// upon loading, if the options and values aren't the same size, let's fill out the values
			console.warn("Options and Values starting states are not in sync for " + this.props.id + ", attempting to correct by utilizing values in from the options.  If multiple choice question fails to appear, the correction may have failed.");

			let initValue = _.cloneDeep(this.props.value);
			if(typeof initValue === "undefined" || Array.isArray(initValue)) {  // if it's an array, we know it's already the wrong size becaue it was checked in isInvalid()
				initValue = {};
			}
		
			Object.keys(this.props.options).forEach((optionLabel) => {
				let optionValue = this.props.options[optionLabel]
				if (typeof initValue[optionLabel] === 'undefined' || initValue[optionLabel] === null) {
					initValue[optionValue] = false;
				}
			})

			console.warn("Correction attempted - initial value: ", initValue);
			if (this.props.alternateChangeHandler) {
				this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, initValue);
			} else {
				this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, initValue);
			}
		}
	  }


	isInvalid = () => {
		return _.isEmpty(this.props.value) || 
			typeof this.props.value === "undefined" || 
			Object.keys(this.props.value).length !== Object.keys(this.props.options).length;
	}

	handleValueChange = choice => event => {
		let newValue = _.cloneDeep(this.props.value);

		newValue[choice] = event.target.checked;
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, newValue);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, newValue);
		}
	};

	render() {
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		if(this.isInvalid()) {
			return null;
		}

		console.log('MC Props :', this.props);
		
		return <FormControl component="fieldset" key={this.props.id}>
			<FormLabel component="legend">{this.props.label}</FormLabel>
			<FormGroup>
				{Object.keys(this.props.options).map((optionLabel) => {
					let optionValue = this.props.options[optionLabel];
					return <FormControlLabel
						key={optionLabel + ":" + this.props.options[optionLabel]}
						control={
							<Checkbox
								checked={this.props.value[optionValue] ? this.props.value[optionValue] : false}
								onChange={this.handleValueChange(this.props.options[optionLabel])}
							/>
						}
						label={optionLabel}
					/>
				})}
			</FormGroup>
		</FormControl>;
	}
}

MultipleChoice.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,

	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['MultipleChoice']).isRequired,
	options: PropTypes.object.isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html


};

const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(MultipleChoice));
