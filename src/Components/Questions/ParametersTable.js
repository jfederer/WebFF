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
const pCodes = {
	"Water Temp C": "P00010",
	"Air Temp C": "P00020",
	"Dissolved Oxygen": "P00300",
	"pH": "P00400",
	"Inst Disch": "P00061",
	"Gage Height": "P00065",
	"Specific Cond": "P00095",
	"Turb NTU, 400-600nm, 90  30 degs": "P63675",
	"Turb, NTRU, 400-600nm, multiple angles": "P63676",
	"Turb, FNU, 780-900nm, 90  2.5 degs": "P63680",
	"Transparency": "P65225",
	"Velocity to compute isokinetic transit rate, feet per second": "P72196"
};

//TODO: add a "null" default for all these

const nq_options = {
	"nQ": null,
	"a": "a",
	"b": "b",
	"e": "e",
	"f": "f",
	"x": "x"
}
const nq_options_meanings = {
	"a": "planned measurement was not made",
	"b": "sample broken/spilled in shipment",
	"e": "required equipment not functional or available",
	"f": "sample discarded: improper filter used",
	"x": "result failed quality assurence review"
}

const rmk_options = {
	"rmk": null,
	"<": "<",
	">": ">",
	"E": "E",
	"M": "M",
	"N": "N",
	"A": "A",
	"V": "V",
	"S": "S",
	"U": "U"
}

const mth_options = {
	"P00061": ["mth", "G0011", "Q-EST", "QADCP", "QFLUM", "QIDIR", "QSCMM", "QSLPQ", "QSTGQ", "QTRAC", "QUNSP", "QVELO", "QVOLM", "QWEIR", "ZEROF"],
	"P00010": ["mth", "G0004", "THM01", "THM02", "THM03", "THM07"],
	"P00020": ["mth", "G0005", "THM04", "THM05"],
	"P00300": ["mth", "AZIDE", "G0017", "G0018", "IND02", "IND03", "INDGO", "INDKT", "LUMIN", "MEMB2", "MEMBR", "RHODA", "SPC10", "WINKL"],
	"P00400": ["mth", "EL003", "EL009", "PAPER", "PROBE"],
	"P00065": ["mth", "ACOUS", "CLIP", "CSG", "ENCD", "ETG", "FLOAT", "G0012", "HWM", "INSD", "LPRNT", "MANO", "NCAC", "NCLZ", "NCRD", "NTRAN", "OTSD", "RP", "STAF1", "STAFF", "STRAN", "WWG"],
	"P00095": ["mth", "SC001", "SC003"],
	"P63675": ["mth", "TBD03", "TS028", "TS088", "TS089", "TS093", "TS094", "TS095", "TS096", "TS097", "TS099", "TS102", "TS103", "TS104", "TS105", "TS106", "TS108", "TS109", "TS110", "TS111", "TS112", "TS113", "TS114", "TS116", "TS117", "TS118", "TS120", "TS121", "TS122", "TS124", "TS126", "TS127", "TS128", "TS130", "TS131", "TS132", "TS133", "TS134", "TS135", "TS136", "TS137", "TS138", "TS158", "TS159", "TS160", "TS161", "TS162", "TS163", "TS164", "TS165", "TS166", "TS188"],
	"P63676": ["mth", "TS027", "TS090", "TS091", "TS092", "TS098", "TS100", "TS101", "TS107", "TS115", "TS116", "TS117", "TS119", "TS123", "TS125", "TS129", "TS141", "TS167", "TS168", "TS169", "TS192", "TS193", "TS196"],
	"P63680": ["mth", "TS031", "TS032", "TS034", "TS035", "TS036", "TS037", "TS038", "TS040", "TS041", "TS042", "TS043", "TS044", "TS047", "TS048", "TS049", "TS050", "TS053", "TS054", "TS055", "TS056", "TS057", "TS058", "TS059", "TS060", "TS061", "TS062", "TS063", "TS064", "TS065", "TS066", "TS067", "TS068", "TS069", "TS070", "TS071", "TS074", "TS075", "TS076", "TS078", "TS080", "TS081", "TS082", "TS084", "TS085", "TS086", "TS087", "TS145", "TS146", "TS147", "TS148", "TS149", "TS150", "TS151", "TS156", "TS173", "TS174", "TS175", "TS176", "TS177", "TS178", "TS189", "TS198", "TS208", "TS209", "TS213", "TS214", "TS216"],
	"P65225": ["mth", "TTUBE"],
	"P72196": ["mth", "SADVM", "UADVM", "V-EST", "VADCP", "VADV", "VELC", "VICE", "VIPAA", "VIPYG", "VOTT", "VPAA", "VPYG", "VRAD", "VTIME", "VTRNS", "VULT"]
}

const types = ["_val", "_mth", "_rmk", "_nq"];

const defaultPCodesToShow = ["P00010", "P00020", "P00061", "P00065", "P00095", "P00300", "P00400"];



class ParametersTable extends React.Component {
	constructor(props) {
		super(props);

		console.log("PARAMETERS TABLE CONSTRUCTOR");
		// sampleEventLocations is a double array whereby each 'row' of the array is teh set and each col is the sample location.
		let nowValue = [];
		let startingPCodes = [];
		if (this.props.value.length === 1 && this.props.value[0].length === 0) {// if no value was sent
			console.log("Handed null value");

			// build header from scratch
			let headerRow = [];
			for (let pCode in defaultPCodesToShow) {
				for (let type in types) {
					headerRow.push(defaultPCodesToShow[pCode] + types[type]);
				}
			}
			nowValue.push(headerRow);

			// build default values (blanks)
			let firstColumn = this.props.getDescriptiveColumnForTable();
			for (let i = 0; i < firstColumn.length; i++) {
				let emptyRow = new Array(headerRow.length).fill("");
				nowValue.push(emptyRow);
			}

			startingPCodes = defaultPCodesToShow;

		} else { // if a value was sent
			// accept the value that was sent for value
			console.log("Handed existing value");

			nowValue = this.props.value;

			// find all pCodes in header
			let pCodesInHeader = [];
			for (let i = 0; i < this.props.value[0].length; i++) {
				let pCode = this.props.value[0][i].split("_")[0];
				if (!pCodesInHeader.includes(pCode)) {
					pCodesInHeader.push(pCode);
				}
			}

			//console.log("Found PCODES: ", pCodesInHeader);
			startingPCodes = pCodesInHeader;
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
		console.log("HEEEEEEEE");
		return pCodesAvailableForAdding;
	}

	render() {
		const { classes } = this.props;
		// let setType = this.props.getCurrentSampleEventMethod();
		let firstColumn = this.props.getDescriptiveColumnForTable();



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
							if (rowNum === 0) return null; //skip the header
							let realRowNum = rowNum;
							return <TableRow key={col + realRowNum}>
									<TableCell className={classes.tableCell}>
										{col}
									</TableCell>
									{this.state.pCodesToShow.map((pCode, colNum) => {
										let realColNum = colNum * types.length;
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