import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import { styles } from '../style';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


//this.state.value always contains the up-to-date question values/answers.
//all other items (options, selects, etc) are pulled from props. //TODO: ensure this is true for all types.

const styles = theme => ({
	root: {
		display: 'flex',
		fullWidth: true,
		wrap: 'nowrap',
		zeroMinWidth: true
	},
	formControl: {
		margin: 0,
		display: 'flex',
		//minWidth: 120,  //TODO: Build in a minWidth based on content?
		fullWidth: true,
		wrap: 'nowrap'
	},
	inputLabel: {
		margin: 0,
		//minWidth: 120,  //TODO: Build in a minWidth based on content?
		fullWidth: true,
		wrap: 'nowrap'
	},
	ppr: {
		backgroundColor: "#9ee"
	}
});


class Question extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value, //FUTURE: Look into just using the XMLvalue as the key and the 'value' as the value... might make conversion to XML simpler.
			key: '',
			currentQuestionValue: this.props.value,
		};
		this.handleTableChange = this.handleTableChange.bind(this);
	};

	componentWillMount() {
		this.setState({ key: this.props.id });;
		this.setState({ value: this.props.value });
	}

	handleToggleChange = name => event => {
		this.setState({ [name]: event.target.checked }, () => this.props.stateChangeHandler(this));
	};


	handleTextChange = value => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		this.setState({
			value: event.target.value
		}, () => this.props.stateChangeHandler(this)
		);
	};

	handleSelectChange = name => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)
		this.setState({ [name]: event.target.value },
			() => this.props.stateChangeHandler(this)
		);
	};

	handleMultiChoiceChange = choiceVal => event => {  //FUTURE: combine the handlers  (or split out question types to sub-components)

		let tempValue = this.state.value;

		if (event.target.checked) {
			tempValue.push(choiceVal);
		} else {
			let index = tempValue.indexOf(choiceVal);
			if (index > -1) {
				tempValue.splice(index, 1);
			} else {
				//TODO: Throw Error
				console.log("ERROR: MultiChoice option requested for removal did not exist in list of checked items in 'value'");
			}
		}

		this.setState({ value: tempValue }, () => this.props.stateChangeHandler(this)
		);
	};

	handleTableChange = name => event => {
		console.log("Here");
		console.log(name);
		console.log(event);
	};


	buildCheckboxOptions(optionsPairs) {  // note, this references props and state... not just passed parameters and blank option could be split out for reuse
		var JSX_return = [];

		for (var optionLabel in optionsPairs) {
			JSX_return.push(
				<FormControlLabel
					key={optionLabel + ":" + optionsPairs[optionLabel]}
					control={
						<Checkbox
							checked={this.state.value && this.state.value.includes(optionsPairs[optionLabel])}
							onChange={this.handleMultiChoiceChange(optionsPairs[optionLabel])}
							value={optionsPairs[optionLabel]}
						/>
					}
					label={optionLabel}
				/>
			);
		}
		return JSX_return;
	}

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
		const DEBUG = false;
		const { classes } = this.props;
		var theQ = {};
		var realPlaceholder = this.props.placeholder ? this.props.placeholder : this.props.XMLvalue;

		//TODO: if key or id isn't included, make the missing one the same as the one that's included
		if (DEBUG) console.log("this.props");
		if (DEBUG) console.log(this.props);


		switch (this.props.type) {
			case 'DropDown': {
				//TODO: age-native-simple
				theQ = (
					<FormControl className={classes.formControl}>
						<InputLabel className={classes.inputLabel} htmlFor="age-native-simple">{this.props.label}</InputLabel>
						<Select
							native
							autoWidth={true}
							value={this.state.value}
							onChange={this.handleSelectChange('value')}
							inputProps={{
								name: this.props.label,
								id: this.props.id,
							}}
						>
							{this.buildSelectOptions(this.props.options)}

						</Select>
					</FormControl>
				);
				break;
			}

			case 'Text': {
				if (DEBUG) console.log("Text Question");
				//theQ = <FormControl className={classes.formControl}>
				theQ = <div>
					<TextField
						value={this.state.value}
						onChange={this.handleTextChange(this.props.key)}
						key={this.props.key}
						id={this.props.id}
						label={this.props.label}
						placeholder={realPlaceholder}
						className={classes.textField}
						fullWidth
						xmlvalue={this.props.XMLValue}
					/>
				</div>
				break;
			}

			case 'MultiText': {
				if (DEBUG) console.log("MultiText Question");
				theQ = <div>
					<TextField
						value={this.state.value}
						onChange={this.handleTextChange(this.props.key)}
						key={this.props.key}
						id={this.props.id}
						label={this.props.label}
						placeholder={realPlaceholder}
						className={classes.textField}
						fullWidth
						xmlvalue={this.props.XMLValue}
						multiline
						rows="4"
					/>
				</div>
				break;
			}
			case 'MultiChoice': {
				if (DEBUG) console.log("MultiChoice Question");
				//Note that MultiChoice builds out state elements in the constructor for defining initial states.				
				theQ =
					<FormControl component="fieldset" key={this.props.key}>
						<FormLabel component="legend">{this.props.label}</FormLabel>
						<FormGroup>

							{this.buildCheckboxOptions(this.props.options)}

						</FormGroup>
					</FormControl>
				break;
			}
			case 'Toggle': {
				if (DEBUG) console.log("Toggle Question");
				theQ =
					<FormControlLabel
						key={this.props.key + "_FormControlLabel"}
						control={
							<Switch
								key={this.props.key}
								id={this.props.id}
								checked={this.state.value}
								onChange={this.handleToggleChange('value')}
								xmlvalue={this.props.XMLValue}
							/>
						}
						label={this.props.label}
					/>
				break;
			}
			case 'Table': {
				if (DEBUG) console.log("Table Question");
				
				
				//TODO: might want to put row and column size info in state for adding later...

				// make appropriately-sized empty table data array
				let tableValues = [];
				for (var i = 0; i< this.props.numberOfRows; i++) {
					let numbRows = parseInt(this.props.colHeaders.length, 10);
					tableValues.push(Array(numbRows).fill(""));
				}

				// go through value in state and drop them into tableValues.
				// this extra step is to deal with mis-matches between intial 'value' settings and the table size
				// additional error-checking worthwhile for when value is (not an array, too big, etc)
				if (this.state.value != null) {
					this.state.value.map((row, rowNum) => {
						row.map((element,colNum) => {
							tableValues[rowNum][colNum]=element;
							return null;
						});
						return null;
					});
				}

				// build the JSX tableRows based on above-calculated tableValues
				let tableRows = [];
				// console.log(this.props);
				// let editedProps = {...this.props, type:"Text"};
				// console.log(editedProps);


				tableValues.map((curRow, row) => {
					tableRows.push(
							<TableRow key={this.state.key + "_row_" + row}> 
							{curRow.map((cellContent, col) => {
								//console.log(cellContent);
								let adHocProps = {...this.props, type:"Text", label:"", value:cellContent}
								return (
									<TableCell key={this.props.key + "_row:" + row + "_col:" + col}>
										{/* {cellContent + "_row:" + row + "_col:" + col} */}
										<Question {...adHocProps} stateChangeHandler={this.handleTableChange("in build")} />
										{/* {cellContent} */}
									</TableCell>
								)
							})}
							</TableRow>
							);
							return null;
				});

				theQ =
					<Table key={this.props.key + "_table"}className={classes.table}>
							<TableHead>
								<TableRow>
							{this.props.colHeaders.map((header) => <TableCell key={this.props.key + header}>{header}</TableCell>)}
								</TableRow>
							</TableHead>
							<TableBody>
								{tableRows}
							</TableBody>
						</Table>
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

Question.propTypes = {
	classes: PropTypes.object.isRequired,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	XMLValue: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['Text', 'MultiText', 'DropDown', 'MultiChoice', 'Toggle', "Table", "Checkbox", "Date", "Time"]).isRequired,  //Toggle is just a single multichoice... implement?
	selectOptions: PropTypes.arrayOf(PropTypes.object),

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(Question);