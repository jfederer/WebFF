import React from 'react';
// import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
//import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
// import Fragment from '@material-ui/core/Fragment';

//TODO: generate minWidth based on content & label
const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	  },
	formControl: {
		margin: 0,
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap'
	},
	inputLabel: {
		margin: 0,
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap'
	}
});

class DropDown extends React.Component {

	componentWillMount() {
		this.setState({ value: this.props.value });
	}

	handleValueChange = name => event => {  
		this.setState({ [name]: event.target.value },
			() => this.props.stateChangeHandler(this)
		);
	};

	render() {
		const { classes } = this.props;
		//let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;

		// if (tooltip != null) {
		// 	return <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}>{this.buildQuestion()}</Tooltip>;

			return <FormControl  
			className={classes.formControl}
			>
						{(this.props.label!=null) ?
							<InputLabel className={classes.inputLabel} htmlFor="age-native-simple">{this.props.label}</InputLabel> :
							null }
						<Select
							native
							// autoWidth={true}
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
	stateChangeHandler: PropTypes.func.isRequired,
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

export default withStyles(styles)(DropDown);