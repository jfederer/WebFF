import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getDateStringFromDate } from '../../Utils/Utilities';


import { SEQuestionValueChange } from '../../Actions/SamplingEvents'

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


/**
 * @description Date input will immediately generate 'todays' date if handed a null 'value'.  Will leave blank if handed a blank ("") value.  Otherwise, will use date passed in YYYY-MM-DD format and display it in MM/DD/YYYY formate.  This is a limitation of material-ui's date textfield.  //TODO: look into https://material-ui-pickers.dev/getting-started/installation
 */
class DateInput extends React.Component {
	
	handleValueChange = value => e => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, e.target.value);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, e.target.value);
		}
	};

	render() {
		const { classes } = this.props;
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		// let thisSize = this.props.size ? this.props.size : 1;

		let dateValue = this.props.value;
		if (dateValue === null) {
			// null creates new 'today' date
			let dateValue = getDateStringFromDate();
			if (this.props.alternateChangeHandler) {
				this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, dateValue);
			} else {
				this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, dateValue);
			}
			return null;
		}

		return <TextField
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			fullWidth
			type="date"
			// value={this.props.value?this.props.value:""}
			value={dateValue}
			className={classes.textField}
			xmltag={this.props.XMLTag}
			InputLabelProps={{
				shrink: true,
			}}
			onChange={this.handleValueChange(this.props.id)}
			style={{ margin: 0 }}
		/>
	}
}

DateInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['DateInput']).isRequired,
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DateInput));
