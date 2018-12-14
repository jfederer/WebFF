import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Select from '@material-ui/core/Select';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Question from '../Question';
import { pCodes, nq_options, nq_options_meanings, rmk_options, mth_options, types, defaultPCodesToShow } from '../../Utils/QuestionOptions';
import { safeCopy } from '../../Utils/Utilities';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		width: '100%',
		tableLayout: 'auto',
		fixedHeader: false
	},
	tableCell: {
		padding: '4px 4px 4px 4px'
	},
	nq_options_meanings: {
		paddingLeft: '50px'
	},
	addColumnButton: {
		float: "right",
		margin: "0px"
	}
});




class ParametersTable extends React.Component {
	constructor(props) {
		super(props);

		console.log("PARAMETERS TABLE CONSTRUCTOR");
		// sampleEventLocations is a double array whereby each 'row' of the array is teh set and each col is the sample location.
		let nowValue = [];
		let startingPCodes = [];
		if (this.props.value === null || (this.props.value.length === 1 && this.props.value[0].length === 0)) {// if no value was sent
			console.log("Handed null value");

			// build header from scratch
			let headerRow = [];
			for (let pCode in defaultPCodesToShow) {
				for (let type in types) {
					headerRow.push(defaultPCodesToShow[pCode] + types[type]);
				}
			}
			headerRow.unshift("Set-Sample @ Dist");
			nowValue.push(headerRow);

			// build default values (blanks)
			let firstColumn = this.props.getDescriptiveColumnForTable();
			console.log("FIRST COLUMN: ", firstColumn);
			for (let i = 1; i < firstColumn.length; i++) {
				let emptyRow = new Array(headerRow.length-1).fill("");
				emptyRow.unshift(firstColumn[i]);
				nowValue.push(emptyRow);
			}

			startingPCodes = safeCopy(defaultPCodesToShow);

		} else { // if a value was sent
			// need to ensure the value has the right number of rows
			console.log("Handed existing value: ", this.props.value);

			// find all pCodes in header
			let pCodesInHeader = [];
			for (let i = 1; i < this.props.value[0].length; i++) { // start at 1 to skip the set-sample @ dist
				let pCode = this.props.value[0][i].split("_")[0];
				if (!pCodesInHeader.includes(pCode)) {
					pCodesInHeader.push(pCode);
				}
			}

			nowValue = [];
			// build new header row, note, the header row should still be correct.
			nowValue.push(safeCopy(this.props.value[0])); // 

			// build rows based on existing values  //TODO: FIXME:
			let firstColumn = this.props.getDescriptiveColumnForTable(); // firstColumn will now be the authoritative new [0] element in each row
			console.log("NEW FIRST COLUMN: ", firstColumn);
			for (let newRowNum = 1; newRowNum < firstColumn.length; newRowNum++) { // start at 1 to skip the header row
				console.log("Looking for...", firstColumn[newRowNum]);
				//look in props.value for existing matching row
				let matchingOldRow = -1;
				for(let oldRow = 1; oldRow < this.props.value.length; oldRow++) {
					console.log("against..." + this.props.value[oldRow][0]);
					if(firstColumn[newRowNum] === this.props.value[oldRow][0]) {
						console.log("MATCH!");
						
						matchingOldRow = oldRow;
						break;
					}
				} 

				let newRow = [];
				if(matchingOldRow != -1) {
					console.log(firstColumn[newRowNum] + " DID find a match");
					newRow = safeCopy(this.props.value[matchingOldRow]);
				} else {
					console.log(firstColumn[newRowNum] + " never found a match");
					
					newRow = new Array(this.props.value[0].length-1).fill("");
					newRow.unshift(firstColumn[newRowNum]);
				}
			 	nowValue.push(newRow);
			}


			startingPCodes = safeCopy(pCodesInHeader);
		}

		this.state = {
			showRmk: false,
			showNQ: false,
			showAddColumnDialog: false,
			showSetDefaultValueDialog: false,
			pCodesToShow: startingPCodes,
			pCodeToAdd: "",
			value: nowValue,
			parameterDefaultValue_val: "",
			parameterDefaultValue_mth: "",
			parameterDefaultValue_rmk: "",
			parameterDefaultValue_nq: "",
			parameterDefaultOverwiteExistingValues: false,
			curPCode: ""
		};


		this.handleValueChange = this.handleValueChange.bind(this);
	}

	componentDidMount() {
		this.props.stateChangeHandler(this);
	}

	getKeyFromValue(obj, value) {
		let retKey = null;
		Object.keys(obj).forEach((key) => {
			if (obj[key] === value) {
				retKey = key;
			}
		});
		return retKey;
	}


	handleValueChange = (row, col) => e => {
		// console.log("this.state.value: ", this.state.value);
		// console.log("row: ", row, "col: ", col);
		// console.log("e.target.value", e.target.value);
		let newVal = this.state.value.slice();
		// console.log("newVal: ", newVal);
		newVal[row][col] = e.target.value;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this) });
	}


	handleSetDefaultValueDialogOpen = (pCode) => {
		this.setState({ curPCode: pCode },
			this.setState({ showSetDefaultValueDialog: true })
		);
	}

	handleSetDefaultValueDialogClose = () => {
		this.setState({
			showSetDefaultValueDialog: false
		}, () =>
				setTimeout(() => {
					this.setState({
						parameterDefaultValue_val: "",
						parameterDefaultValue_mth: "",
						parameterDefaultValue_rmk: "",
						parameterDefaultValue_nq: "",
						parameterDefaultOverwiteExistingValues: false
					});
				}, 250));
	}

	handleSetDefaultValueDialogChange = (Q) => {
		this.setState({ [Q.props.id]: Q.state.value })
	}

	handleSetDefaultValueForColumn = () => {
		// get the questions with values
		let qsWithVaues = [];
		if (this.state.parameterDefaultValue_val !== "") {
			qsWithVaues.push('val');
		}
		if (this.state.parameterDefaultValue_mth !== "") {
			qsWithVaues.push('mth');
		}
		if (this.state.parameterDefaultValue_rmk !== "") {
			qsWithVaues.push('rmk');
		}
		if (this.state.parameterDefaultValue_nq !== "") {
			qsWithVaues.push('nq');
		}

		let newVal = this.state.value.slice();
		for (let i = 0; i < qsWithVaues.length; i++) {
			for (let colNum = 0; colNum < newVal[0].length; colNum++) {
				if (newVal[0][colNum] === this.state.curPCode + "_" + qsWithVaues[i]) {
					// we are in the right column, colNum
					for (let rowNum = 1; rowNum < newVal.length; rowNum++) {
						if (this.state.parameterDefaultOverwiteExistingValues || newVal[rowNum][colNum] === "") {
							newVal[rowNum][colNum] = this.state["parameterDefaultValue_" + qsWithVaues[i]];
						}
					}
				}
			}
		}

		this.setState({ value: newVal }, () => this.props.stateChangeHandler(this));
		this.handleSetDefaultValueDialogClose();
	}

	handleShowAddColumnDialog = () => {
		this.setState({ showAddColumnDialog: true });
	}

	handleAddColumnDialogClose = () => {
		this.setState({ showAddColumnDialog: false });
	}

	handleAddColumnDialogDropDownChange = (dd) => {
		this.setState({ pCodeToAdd: dd.state.value })
	}

	handleAddColumn = () => {
		// console.log("ADDDDDDDDD: ")
		// console.log("PCODES TO SHOW: ", this.state.pCodesToShow);
		// console.log("VALUE: ", this.state.value);

		let newPCodesToShow = this.state.pCodesToShow.slice();
		let newValue = this.state.value.slice();

		// add new item to the header (pCodesToShow is the visual header row
		newPCodesToShow.push(this.state.pCodeToAdd);

		// add new pcode true 'value' header items 
		for (let type in types) {
			newValue[0].push(this.state.pCodeToAdd + types[type]);
		}

		for (let i = 1; i < newValue.length; i++) {
			// for(let k=0; k<types.length; k++) {
			newValue[i].push("");
			newValue[i].push("");
			newValue[i].push("");
			newValue[i].push("");
			// }
		}
		console.log("POST PCODES TO SHOW: ", newPCodesToShow);
		console.log("POST VALUE: ", newValue);

		this.setState({ pCodesToShow: newPCodesToShow, value: newValue }, this.props.stateChangeHandler(this));
		this.handleAddColumnDialogClose();
	}

	deleteItemFromObject(obj, item) {
		delete obj[item];
		return obj;
	}

	getPCodesAvailableForAdding() {
		let pCodesAvailableForAdding = {};
		let availPCodeKeys = Object.keys(pCodes).filter((pkey) => {
			return !this.state.pCodesToShow.includes(pCodes[pkey])
		});
		for (let i = 0; i < availPCodeKeys.length; i++) {
			pCodesAvailableForAdding[availPCodeKeys[i]] = pCodes[availPCodeKeys[i]];
		}
		return pCodesAvailableForAdding;
	}

	render() {
		const { classes } = this.props;
		// let setType = this.props.getCurrentSampleEventMethod();
		let firstColumn = this.props.getDescriptiveColumnForTable();

		console.log("PCODES TO SHOW: ", this.state.pCodesToShow);

		

		return (
			<React.Fragment>
				{/* <Paper className={classes.root}> */}
				<Button className={classes.addColumnButton} onClick={this.handleShowAddColumnDialog}>Add</Button>
				<Table className={classes.table}>

					<TableHead>

						<TableRow>
							<TableCell className={classes.tableCell}>{firstColumn[0]}</TableCell>
							{this.state.pCodesToShow.map((header) => {
								return (
									<TableCell className={classes.tableCell} key={"Param_" + header}>
										{this.getKeyFromValue(pCodes, header)}
										<br />
										({header})
									<br />
										<button onClick={() => this.handleSetDefaultValueDialogOpen(header)}>Set Default</button>
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{firstColumn.map((col, rowNum) => {
							if (rowNum === 0) return null; //skip the header because the 'real' header row is long
							let realRowNum = rowNum;
							return <TableRow key={col + realRowNum}>
								<TableCell className={classes.tableCell}>
									{this.state.value[rowNum][0]}
								</TableCell>
								{this.state.pCodesToShow.map((pCode, colNum) => {
									let realColNum = (colNum * types.length) + 1;
									return <TableCell key={pCode + realRowNum} className={classes.tableCell}>
										{/* VALUE */}
										<input
											id={pCode + "_val_" + realRowNum + 1}
											type="text" size={1}
											placeholder="Value"
											value={this.state.value[realRowNum][realColNum]}
											onChange={this.handleValueChange(realRowNum, realColNum)} />

										{/* METHOD CODE */}
										<select
											id={pCode + "_mth_" + (realRowNum + 1)}
											value={this.state.value[realRowNum][realColNum + 1]}
											onChange={this.handleValueChange(realRowNum, realColNum + 1)}
										>
											{mth_options[pCode].map(mthCode => <option key={"mth_row:" + realRowNum + "_col:" + realColNum + "opt:" + mthCode} value={mthCode}>{mthCode}</option>)}
										</select>

										{/* REMARK CODE */}
										<select
											hidden={!this.state.showRmk}
											id={pCode + "Rmk_" + (realRowNum + 1)}
											value={this.state.value[realRowNum][realColNum + 2]}
											onChange={this.handleValueChange(realRowNum, realColNum + 2)} >
											{Object.keys(rmk_options).map(key => <option key={"rmk_row:" + realRowNum + "_col:" + realColNum + "opt:" + key} value={rmk_options[key]}>{key}</option>)}
										</select>

										{/* NULL QUALIFIER */}
										<select
											hidden={!this.state.showNQ}
											id={pCode + "_nq_" + (realRowNum + 1)}
											value={this.state.value[realRowNum][realColNum + 3]}
											onChange={this.handleValueChange(realRowNum, realColNum + 3)}>
											{Object.keys(nq_options).map(key => <option key={"nq_row:" + realRowNum + "_col:" + realColNum + "opt:" + key} value={nq_options[key]}>{key}</option>)}
										</select>
									</TableCell>
								})}
							</TableRow>
						})}
					</TableBody>
				</Table>
				<center>
					<Button onClick={(() => this.setState({ showNQ: !this.state.showNQ }))}>{this.state.showNQ ? "Hide " : "Show "}{"Null Qualifiers"}</Button>
					<Button onClick={(() => this.setState({ showRmk: !this.state.showRmk }))}>{this.state.showRmk ? "Hide " : "Show "}{"Remark Codes"}</Button>
				</center>

				{this.state.showNQ
					? <Paper>
						{Object.keys(nq_options_meanings).map((key) =>
							<Typography key={"paramNQMeanings_" + key} className={classes.nq_options_meanings}>
								<b>{key}</b>{"  :  " + nq_options_meanings[key]}
							</Typography>)}
					</Paper>
					: null}
				{this.state.showAddColumnDialog
					? <Dialog
						open={this.state.showAddColumnDialog}
						onClose={this.handleAddColumnDialogClose}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">Add Column</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Select the pcode you'd like to add a column for:
				  			</DialogContentText>
							<Question
								autoFocus
								label="PCode to Add"
								id="PCode Dialog Drop Down"
								key="PCode Dialog Drop Down"
								options={this.getPCodesAvailableForAdding()}
								type="DropDown"
								includeBlank={true}
								stateChangeHandler={this.handleAddColumnDialogDropDownChange}
								value={this.state.pCodeToAdd}
								fullWidth
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleClose} color="primary">
								Cancel
				  </Button>
							<Button onClick={this.handleAddColumn} color="primary">
								Add
				  </Button>
						</DialogActions>
					</Dialog>
					: null}


				<Dialog
					open={this.state.showSetDefaultValueDialog}
					onClose={this.handleSetDefaultValueDialogClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Set Default Value</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Set the values you'd like to be the default for this column.<br />
							Note, this will not overwrite existing values.
				  </DialogContentText>
						<Question
							autoFocus
							label="Value"
							id="parameterDefaultValue_val"
							key="parameterDefaultValue_val"
							type="Text"
							stateChangeHandler={this.handleSetDefaultValueDialogChange}
							value={this.state.parameterDefaultValue_val}
						/>
						<Question
							label="Method"
							id="parameterDefaultValue_mth"
							key="parameterDefaultValue_mth"
							options={this.state.curPCode
								? this.deleteItemFromObject(Object.assign({},
									mth_options[this.state.curPCode].reduce((acc, cur, i) => {
										acc[cur] = cur;
										return acc;
									}, {})), 'mth')
								: {}}
							type="DropDown"
							includeBlank={true}
							stateChangeHandler={this.handleSetDefaultValueDialogChange}
							value={this.state.parameterDefaultValue_mth}
						/>
						<Question
							label="Remark"
							id="parameterDefaultValue_rmk"
							key="parameterDefaultValue_rmk"
							options={this.deleteItemFromObject(Object.assign({}, rmk_options), 'rmk')}
							type="DropDown"
							includeBlank={true}
							stateChangeHandler={this.handleSetDefaultValueDialogChange}
							value={this.state.parameterDefaultValue_rmk}
						/>
						<Question
							label="Null Qualifier"
							id="parameterDefaultValue_nq"
							key="parameterDefaultValue_nq"
							options={this.deleteItemFromObject(Object.assign({}, nq_options), 'nQ')}
							type="DropDown"
							includeBlank={true}
							stateChangeHandler={this.handleSetDefaultValueDialogChange}
							value={this.state.parameterDefaultValue_nq}
						/>
						<Question
							label="Overwrite Existing Values"
							id="parameterDefaultOverwiteExistingValues"
							key="parameterDefaultOverwiteExistingValues"
							checkbox={true}
							type="Toggle"
							stateChangeHandler={this.handleSetDefaultValueDialogChange}
							value={this.state.parameterDefaultOverwiteExistingValues}
						/>

					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleSetDefaultValueDialogClose} color="primary">
							Cancel
				  </Button>
						<Button onClick={this.handleSetDefaultValueForColumn} color="primary">
							Set Default
				  </Button>
					</DialogActions>
				</Dialog>


			</React.Fragment>
		);
	}
}


ParametersTable.propTypes = {
	classes: PropTypes.object.isRequired,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(["ParametersTable"]).isRequired,
	selectOptions: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(styles)(ParametersTable);