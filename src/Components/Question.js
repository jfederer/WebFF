import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import { styles } from '../style';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


//this.state.value always contains the up-to-date question values/answers.
const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});


class Question extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '', //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
			key: ''
		};
	};


	getProps() {
		return this.props;
	}

	componentWillMount() {
		this.setState({ key: this.props.id });;
		this.setState({ value: this.props.value });



		// .map(valueLabelPair => {
		// 	if(valueLabelPair.selected) {
		// 		console.log("selected found");
		// 		return valueLabelPair.label;
		// 	}
		// });
		//console.log(selectLabel);


		// if (this.props.type === "MultiChoice") { // Set initial "checked" states of MultiChoice questions
		// 	var newValObj = {};

		// 	this.props.value.map(multiSelectOption => {
		// 		newValObj[multiSelectOption.label] = multiSelectOption.checked;
		// 		return null;
		// 	}
		// 	);

		// 	this.setState({ value: newValObj });
		// }
	}

	componentDidMount() {
		if (this.props.type === "DropDown") {
			for (var i = 0; i < this.props.value.length; i++) {
				if (this.props.value[i].selected) {
					// *works* console.log("selected found: " + this.props.value[i].label);
					this.setState({ selectLabel: this.props.value[i].label });
				}
			}
		}
	}


	handleSelectChange = event => {  //FUTURE: combine the handlers
		console.log("Event.target: ");
		console.log(event.target); // contains the value of the selected MenuItem and the name of the select
		this.setState({ [event.target.name]: event.target.value });


		// this.setState({
		// 	value: event.target.value,
		// }, () => this.props.stateChangeHandler(this)
		// );
	};

	handleTextChange = value => event => {  //FUTURE: combine the handlers
		this.setState({
			value: event.target.value
		}, () => this.props.stateChangeHandler(this)
		);

	};

	handleMultiChoiceChange = label => event => {  //FUTURE: combine the handlers
		this.setState({
			value: {
				...this.state.value,
				[label]: event.target.checked,
			}
		}, () => this.props.stateChangeHandler(this)
		);
	};



	buildQuestion() {
		const DEBUG = false;
		const { classes } = this.props;
		var theQ = {};
		var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;//TODO: Ask Ken: Do we want this to be the XML value?
		//TODO: if key or id isn't included, make the missing one the same as the one that's included
		if (DEBUG) console.log("this.props");
		if (DEBUG) console.log(this.props);


		switch (this.props.type) {
			case 'DropDown': {
				var menuItems = [];
				var defaultVal = '';
				for (var i = 0; i < this.props.value.length; i++) {
					var tpv = this.props.value[i];
					tpv.selected ? defaultVal = tpv.label : null;
					menuItems.push(
						<MenuItem
							key={this.props.XMLvalue + "_" + tpv.label}
							value={tpv.value}
						>
							{tpv.label}
						</MenuItem>
					);
				}
				console.log("defVal: " + defaultVal);
				theQ = (
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor={this.props.label}>{this.props.label}</InputLabel>
						<Select
							defaultValue={ defaultVal }
							value={this.state.selectLabel}
							onChange={this.handleSelectChange}
							inputProps={{
								name: 'selectLabel',  // this name is defining the 'name' in the event to which the value in the selected menu item is assigned (aka: this is the 'key' in state)
								id: this.props.label,
							}}
						>
							{menuItems}
						</Select>
					</FormControl>





					// <FormControl className={classes.formControl} key={this.props.key}>
					// 	<InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
					// 	<Select
					// 		onChange={this.handleSelectChange}
					// 		value={selectLabel}
					// 		id={this.props.id}
					// 		name={this.state.XMLvalue}
					// 	>
					// 		{this.props.value.map(valueLabelPair =>
					// 			<MenuItem
					// 				key={this.props.XMLvalue + "_" + valueLabelPair.label}
					// 				value={valueLabelPair.value}
					// 			>
					// 				{valueLabelPair.label}
					// 			</MenuItem>
					// 		)}
					// 	</Select>
					// </FormControl>


				);
				break;
			}

			case 'Text': {
				if (DEBUG) console.log("Text Question");
				theQ =
					<TextField
						value={this.state.value}
						onChange={this.handleTextChange(this.props.key)}
						key={this.props.key}
						id={this.props.id}
						label={this.props.label}
						placeholder={realPlaceholder}
						className={classes.textField}
						margin="normal"
						xmlvalue={this.props.XMLvalue}
					/>
				break;
			}

			case 'MultiText': {
				if (DEBUG) console.log("MultiText Question");
				theQ = <TextField
					value={this.state.value}
					onChange={this.handleTextChange(this.props.key)}
					key={this.props.key}
					id={this.props.id}
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
				if (DEBUG) console.log("MultiChoice Question");
				//Note that MultiChoice builds out state elements in the constructor for defining initial states.				
				theQ =
					<FormControl component="fieldset" key={this.props.key}>
						<FormLabel component="legend">{this.props.label}</FormLabel>
						<FormGroup>

							{this.props.value.map(multiSelectOption => {
								return (
									<FormControlLabel
										key={this.props.XMLvalue + multiSelectOption.label}
										control={
											<Checkbox
												checked={this.state.value[multiSelectOption.label]}
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
				console.log("Question doesn't match any type");
				//FIXME: by not returning a question with a key, this throws a application-wide error... 
			}
		}
		return theQ;
	};



	render() {
		//console.log(this.state);
		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		// The problem with the first attempt at that was that the drop down did not display the selection after selecting
		return (
			<div>
				{this.buildQuestion()}
			</div>

		);
	}
}

Question.propTypes = {
	classes: PropTypes.object.isRequired,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
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