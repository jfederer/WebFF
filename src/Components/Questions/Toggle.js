import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';


import { SEQuestionValueChange } from '../../Actions/SamplingEvents'
//this.state.value always contains the up-to-date question values/answers.
//all other items (options, selects, etc) are pulled from props. //TODO: ensure this is true for all types.

const styles = theme => ({

});

class Toggle extends React.Component {

	// componentWillMount() {
	// 	this.setState({ value: this.props.value });
	// }


	handleValueChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, event.target.checked);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, event.target.checked);
		}
	};

	// handleToggleChange = name => event => {
	// 	this.setState({ [name]: event.target.checked }, () => this.props.stateChangeHandler(this));
	// };

	render() {
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		// const { classes } = this.props;
		// var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLTag; 
		let controlElement;

		if (this.props.checkbox === true) {
			controlElement = <Checkbox
				key={this.props.id}
				id={this.props.id}
				checked={this.props.value}
				onChange={this.handleValueChange('value')}
				xmltag={this.props.XMLTag}
			/>
		} else {
			controlElement = <Switch
				key={this.props.id}
				id={this.props.id}
				checked={this.props.value}
				onChange={this.handleValueChange('value')}
				xmltag={this.props.XMLTag}
			/>
		}

		if (this.props.label != null) {
			return <FormControlLabel
				key={this.props.id + "_FormControlLabel"}
				control={controlElement}
				label={this.props.label}
			/>
		} else {
			return controlElement;
		}

	}
}

Toggle.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	// stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['Toggle']).isRequired,
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Toggle));