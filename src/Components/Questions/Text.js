import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

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


var inputProps = {
	size: 4
}

class Text extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
		};
	};

	componentWillMount() {
		this.setState({ value: this.props.value });
	}

	handleValueChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		console.log("here");
		console.log(value);
		console.log(event.target.value);
		console.log(this);
		this.setState({
			value: event.target.value
		}, () => this.props.stateChangeHandler(this)
		);
	};

	render() {
		const { classes } = this.props;

		let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
		let thisSize = this.props.size ? this.props.size : 1;
		let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;
		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting
		return <TextField
			value={this.state.value}
			onChange={this.handleValueChange(this.props.id)}
			key={this.props.id}
			id={this.props.id}
			label={this.props.label}
			placeholder={realPlaceholder}
			className={classes.textField}
			fullWidth
			xmlvalue={this.props.XMLValue}
			inputProps={{
				size: thisSize
			}}
		/>;

	}
}

Text.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLValue: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['Text', 'MultiText', 'DropDown', 'MultiChoice', 'Toggle', "Table", "Checkbox", "Date", "Time"]).isRequired,  //Toggle is just a single multichoice... implement?
	selectOptions: PropTypes.arrayOf(PropTypes.object),

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(Text);