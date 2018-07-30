import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { mathStringReformat } from '../../Utils/MathUtilities';

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

class ComputedValue extends React.Component {
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
		this.setState({
			value: event.target.value
		}, () => {
			console.log("Changed text value");
			console.log(this.props.stateChangeHandler);
			this.props.stateChangeHandler(this)
		}
		);
	};

	render() {
		const { classes } = this.props;

		// let tooltip = this.props.helperText ? this.props.helperText : this.props.XMLValue;
		//TODO: generate minimum size
		let thisSize = this.props.size ? this.props.size : 1;
		let realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;

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
				size: thisSize,
				readOnly: true
			}}
			multiline={this.props.multiline}
			rows={this.props.rows}
		/>;

	}
}

ComputedValue.propTypes = {
	computationString: PropTypes.string.isRequired,
	classes: PropTypes.object,
	validator: PropTypes.func,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string.isRequired,
	XMLValue: PropTypes.string,
	type: PropTypes.oneOf(['ComputedValue']).isRequired,
	helperText: PropTypes.string

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(ComputedValue);