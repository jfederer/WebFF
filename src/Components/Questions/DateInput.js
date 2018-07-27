import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

//this.state.value always contains the up-to-date question values/answers.

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

class DateInput extends React.Component {
	constructor(props) {
		super(props);
		console.log("CONSTRUCTOR: Props.value: ", props.value);
		if (this.props.value != null) {
			console.log("CONSTRUCTOR: Props.value not equal null");
			this.state = {
				value: this.props.value
			};
		} else {
			console.log("CONSTRUCTOR: props.value equals null")
			let d = new Date();
			console.log("CONSTRUCTOR: Date: ", d)
			let dateString = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
			console.log("CONSTRUCTOR: datestring: ", dateString);
			this.state = {
				value: dateString
			}
			console.log("CONSTRUCTOR: state.value: ", this.state.value);
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
		console.log("value: ", this.state.value);
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
		// let thisSize = this.props.size ? this.props.size : 1;
		// let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;
		//TODO: put in current time as default if nothing is passed
		return <TextField
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			fullWidth
			type="date"
			value={this.state.value}
			className={classes.textField}
			xmlvalue={this.props.XMLValue}
			InputLabelProps={{
				shrink: true,
			}}
			onChange={this.handleValueChange(this.props.id)}
		/>
	}
}

DateInput.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['DateInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(DateInput);