import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

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
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
		};
	};

	componentWillMount() {
		this.setState({ key: this.props.id });;
		this.setState({ value: this.props.value });
	}

	handleValueChange = name => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		this.setState({ [name]: event.target.value },
			() => this.props.stateChangeHandler(this)
		);
	};

	buildSelectOptions(optionsPairs) {  // note, this references props and blank option could be split out for reuse
		var JSX_return = [];

		if (this.props.includeBlank && this.props.includeBlank === true) {
			JSX_return.push(<option key="nada" value="" />);
		}

		for (var optionLabel in optionsPairs) {
			JSX_return.push(<option key={optionLabel} value={optionsPairs[optionLabel]}>{optionLabel}</option>);
		}
		return JSX_return;
	}

	buildQuestion() {
		const { classes } = this.props;

				return (
					// <FormControl className={classes.formControl}>
					<div>
						{(this.props.label!=null) ?
							<InputLabel className={classes.inputLabel} htmlFor="age-native-simple">{this.props.label}</InputLabel> :
							null }
						<Select
							native
							// autoWidth={true}
							fullWidth
							value={this.state.value}
							onChange={this.handleValueChange('value')}
							inputProps={{
								name: this.props.label,
								id: this.props.id,
							}}
						>
							{this.buildSelectOptions(this.props.options)}

						</Select>
						</div>
					// </FormControl>
				);
	};



	render() {
		let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;

		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting

		if (tooltip != null) {
			return <Tooltip title={tooltip} enterDelay={500} leaveDelay={200}><Paper>{this.buildQuestion()}</Paper></Tooltip>;
		} else {
			return <Paper>{this.buildQuestion()}</Paper>;
		}

	}
}

DropDown.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['DropDown']).isRequired,
	options: PropTypes.object.isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(DropDown);