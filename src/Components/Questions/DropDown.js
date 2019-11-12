import React from 'react';
import { connect } from 'react-redux';
// import { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
//import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents' 


//TODO: generate minWidth for select based on content & label
//TODO: have select/drop down question fill entire paper over it
const styles = theme => ({

	root: {
		display: 'flex',
		flexWrap: 'wrap',
	  },
	formControl: {
	// 	margin: 0,
	// 	display: 'flex',
		fullWidth: true,
	// 	flexWrap: 'wrap',
	},
	inputLabel: {
		margin: 0,
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap'
	},
	select: {
		minWidth:"200px",
		backgroundColor: '#eee',
	}
});

class DropDown extends React.Component {

	handleValueChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		if(this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, event.target.value);
		} else {
		this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, event.target.value);
		}
	};

	render() {
		const { classes } = this.props;
		//TODO: let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		// if (tooltip != null) {
		// 	return <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}>{this.buildQuestion()}</Tooltip>;

		
		//check for required info, return null if required elements are missing....
		if(!this.props.options) {
			// this occuring with fire an error from the propTypes checks... but at least this will keep it from crashing.
			return null;
		}
		
			return <FormControl  
			className={classes.formControl}
			>
						{(this.props.label!=null) ?
							<InputLabel className={classes.inputLabel} htmlFor="age-native-simple">{this.props.label}</InputLabel> :
							null }
						<Select
							style={{minWidth: 200}}
							// style={{backgroundColor: '#00e'}}
							native
							fullWidth
							value={this.props.value}
							onChange={this.handleValueChange('value')}
							inputProps={{
								name: this.props.label,
								id: this.props.id,
							}}
						>
						{this.props.includeBlank ? <option key="nada" value="" /> : null }
						{Object.keys(this.props.options).map((optionLabel, index)=> <option key={optionLabel} value={this.props.options[optionLabel]}>{optionLabel}</option>)}

						</Select>
					 </FormControl>
	}
}

DropDown.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['DropDown']).isRequired,
	options: PropTypes.object.isRequired,
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
	SEQuestionValueChange,
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DropDown));
