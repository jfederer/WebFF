import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents'

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		
	},
	textField: {
		marginLeft: 0,
		marginRight: 0
	},
});

class Text extends React.Component {
	


	handleValueChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, event.target.value);
	};

	render() {
		const { classes } = this.props;

		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		let thisSize = this.props.size ? this.props.size : 1;
		let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLTag;

		return <TextField
			value={this.props.value?this.props.value:""}
			onChange={this.handleValueChange("value")}
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			placeholder={realPlaceholder}
			className={classes.textField}
			fullWidth
			xmltag={this.props.XMLTag}
			inputProps={{
				size: thisSize
			}}
			multiline={this.props.multiline}
			rows={this.props.rows}
			required={this.props.required}
		/>;

	}
}

Text.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLTag: PropTypes.string,
	multiline: PropTypes.bool,
	rows: PropTypes.number,
	type: PropTypes.oneOf(['Text']).isRequired,
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

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Text));