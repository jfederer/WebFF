import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';



class Question extends React.Component {
constructor(props) {
	super(props);
	this.state = {
		value: '', //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
	};
	if (this.props.type === "MultiChoice") {
		this.props.multiChoiceOptions.map(multiSelectOption => this.state[multiSelectOption.label]=multiSelectOption.checked);
	}
};
	
	componentDidMount() {
		

	}

	handleSelectChange = event => {  //FUTURE: combine the handlers
		this.setState({ [event.target.name]: event.target.value });
		this.setState({
			value: event.target.value,
		})
	};

	handleTextChange = value => event => {
		this.setState({
			value: event.target.value,
		});
	};

	handleMultiChoiceChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};



	buildQuestion() {
		const { classes } = this.props;
		var theQ = {};
		var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;//TODO: Ask Ken: Do we want this to be the XML value?


		switch (this.props.type) {
			case 'DropDown': {
				theQ = (
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
						<Select
							value={this.state.value}
							onChange={this.handleSelectChange}
							id={this.props.id}
							name={this.props.XMLvalue}
						>
							{this.props.selectOptions.map(valueLabelPair =>
								<MenuItem key={this.props.XMLvalue + valueLabelPair.label} value={valueLabelPair.value} xmlvalue={this.props.XMLvalue}>{valueLabelPair.label}</MenuItem>
							)}
						</Select>
					</FormControl>
				);
				break;
			}

			case 'Text': {
				theQ =
					<TextField
						id={this.props.id}
						onChange={this.handleTextChange(this.props.id)}
						label={this.props.label}
						placeholder={realPlaceholder}
						className={classes.textField}
						margin="normal"
						xmlvalue={this.props.XMLvalue}
					/>
				break;
			}

			case 'MultiText': {
				theQ = <TextField
					id={this.props.id}
					onChange={this.handleTextChange(this.props.id)}
					label={this.props.label}
					placeholder={realPlaceholder}
					className={classes.textField}
					margin="normal"
					xmlvalue={this.props.XMLvalue}
					multiline
					rows="4"
				/>
				break;
			}

			case 'MultiChoice': { 
				//Note that MultiChoice builds out state elements in the constructor for defining initial states.				
				theQ =
					<FormControl component="fieldset">
						<FormLabel component="legend">{this.props.label}</FormLabel>
						<FormGroup>

							{this.props.multiChoiceOptions.map(multiSelectOption => {
								return (
									<FormControlLabel
										key={this.props.XMLvalue + multiSelectOption.label}
										control={
											<Checkbox
												checked={this.state[multiSelectOption.label]}
												onChange={this.handleMultiChoiceChange(multiSelectOption.label)}
												value={multiSelectOption.value}
												xmlvalue={this.props.XMLvalue}
											/>
										}
										label={multiSelectOption.label}
									/>
								)
							}
							)}
						</FormGroup>
					</FormControl>
				break;
			}
			default: {
				//TODO: Throw error
				console.err.log("Question doesn't match any type");
			}
		}
		return theQ;
	};



	render() {
		return (
			<div>
				{this.buildQuestion()}
				{console.log(this.state)}
			</div>
		);
	}
}

Question.propTypes = {
	classes: PropTypes.object.isRequired,
	validator: PropTypes.func,

	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	XMLvalue: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['Text', 'MultiText', 'DropDown', 'MultiChoice', 'Toggle']).isRequired,  //Toggle is just a single multichoice... implement?
	selectOptions: PropTypes.arrayOf(PropTypes.object),

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(Question);