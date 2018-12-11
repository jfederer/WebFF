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
		let DEBUG = false;
		super(props);
		if (DEBUG) console.log("DateInput: CONSTRUCTOR: Props.value: ", props.value);
		if (this.props.value != null) {
			this.state = {
				value: this.props.value
			};
		} else {
			if (DEBUG) console.log("DateInput: CONSTRUCTOR: props.value was null, building 'now' datestring")
			let d = new Date();
			if (DEBUG) console.log("CONSTRUCTOR: Date: ", d)
			let dateOfMonthString = ('0' + d.getDate()).slice(-2);
			let monthString = ('0' + (d.getMonth() + 1)).slice(-2);
			let dateString = d.getFullYear() + "-" + monthString + "-" + dateOfMonthString;
			if (DEBUG) console.log("DateInput: CONSTRUCTOR: datestring: ", dateString);
			this.state = {
				value: dateString
			}
		}
	};

	componentWillMount() {
		this.props.stateChangeHandler(this);
		//this.setState({ value: this.props.value });
	}

	handleValueChange = value => event => {
		this.setState({
			value: event.target.value
		}, () => {
			//console.log(this.props.stateChangeHandler);
			this.props.stateChangeHandler(this)
		}
		);
	};

	getDateString(date) {
		console.log(date);
		
		return date.getUTCFullYear() + "/" +
			("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
			("0" + date.getUTCDate()).slice(-2);
	}

	render() {
		const { classes } = this.props;
		//console.log("value: ", this.state.value);
		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLTag;
		// let thisSize = this.props.size ? this.props.size : 1;
		return <TextField
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			fullWidth
			type="date"
			value={this.state.value}
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
	stateChangeHandler: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(['DateInput']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(DateInput);