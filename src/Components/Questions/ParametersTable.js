import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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
	}
});
const pCodes = {
	"P00010": "Water Temp C",
	"P00020": "Air Temp C",
	"P00061": "Inst Disch",
	"P00065": "Gage Height",
	"P00095": "Specific Cond",
	"P63675": "Turb NTU, 400-600nm, 90  30 degs",
	"P63676": "Turb, NTRU, 400-600nm, multiple angles",
	"P63680": "Turb, FNU, 780-900nm, 90  2.5 degs",
	"P65225": "Transparency",
	"P72196": "Velocity to compute isokinetic transit rate, feet per second"
};

//TODO: add a "null" default for all these

const nQ_options = {
	"nQ": null,
	"a": "a",
	"b": "b",
	"e": "e",
	"f": "f",
	"x": "x"
}
const nQ_options_meanings = {
	"nQ": null,
	"a": "planned measurement was not made",
	"b": "sample broken/spilled in shipment",
	"e": "required equipment not functional or available",
	"f": "sample discarded: improper filter used",
	"x": "result failed quality assurence review"
}

const rmk_options = {
	"rmk":null,
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
	"P00065": ["mth", "ACOUS", "CLIP", "CSG", "ENCD", "ETG", "FLOAT", "G0012", "HWM", "INSD", "LPRNT", "MANO", "NCAC", "NCLZ", "NCRD", "NTRAN", "OTSD", "RP", "STAF1", "STAFF", "STRAN", "WWG"],
	"P00095": ["mth", "SC001", "SC003"],
	"P63675": ["mth", "TBD03", "TS028", "TS088", "TS089", "TS093", "TS094", "TS095", "TS096", "TS097", "TS099", "TS102", "TS103", "TS104", "TS105", "TS106", "TS108", "TS109", "TS110", "TS111", "TS112", "TS113", "TS114", "TS116", "TS117", "TS118", "TS120", "TS121", "TS122", "TS124", "TS126", "TS127", "TS128", "TS130", "TS131", "TS132", "TS133", "TS134", "TS135", "TS136", "TS137", "TS138", "TS158", "TS159", "TS160", "TS161", "TS162", "TS163", "TS164", "TS165", "TS166", "TS188"],
	"P63676": ["mth", "TS027", "TS090", "TS091", "TS092", "TS098", "TS100", "TS101", "TS107", "TS115", "TS116", "TS117", "TS119", "TS123", "TS125", "TS129", "TS141", "TS167", "TS168", "TS169", "TS192", "TS193", "TS196"],
	"P63680": ["mth", "TS031", "TS032", "TS034", "TS035", "TS036", "TS037", "TS038", "TS040", "TS041", "TS042", "TS043", "TS044", "TS047", "TS048", "TS049", "TS050", "TS053", "TS054", "TS055", "TS056", "TS057", "TS058", "TS059", "TS060", "TS061", "TS062", "TS063", "TS064", "TS065", "TS066", "TS067", "TS068", "TS069", "TS070", "TS071", "TS074", "TS075", "TS076", "TS078", "TS080", "TS081", "TS082", "TS084", "TS085", "TS086", "TS087", "TS145", "TS146", "TS147", "TS148", "TS149", "TS150", "TS151", "TS156", "TS173", "TS174", "TS175", "TS176", "TS177", "TS178", "TS189", "TS198", "TS208", "TS209", "TS213", "TS214", "TS216"],
	"P65225": ["mth", "TTUBE"],
	"P72196": ["mth", "SADVM", "UADVM", "V-EST", "VADCP", "VADV", "VELC", "VICE", "VIPAA", "VIPYG", "VOTT", "VPAA", "VPYG", "VRAD", "VTIME", "VTRNS", "VULT"]
}

const types = ["_val", "_mth", "_rmk", "_nQ"];

const defaultPCodesToShow = ["P00010", "P00020", "P00061", "P00065", "P00095"];

class ParametersTable extends React.Component {
	constructor(props) {
		super(props);

		// sampleEventLocations is a double array whereby each 'row' of the array is teh set and each col is the sample location.
		console.log("const!");

		let nowValue = [];

		console.log(this.props.value.length);

		if(this.props.value.length===1 && this.props.value[0].length===0) {
			console.log("Building new header");
			// build header from scratch
			let headerRow = [];
			for(let pCode in defaultPCodesToShow) {
				for(let type in types) {
					headerRow.push(defaultPCodesToShow[pCode]+types[type]);
				}
			}
			nowValue.push(headerRow);


			// build default values (blanks)
			let firstColumn = this.buildFirstColumn();
			for (let i=0; i<firstColumn.length; i++) {
				let emptyRow = new Array(headerRow.length).fill("");
				nowValue.push(emptyRow);
			}
			
		} else {
			// accept the value that was sent...
			nowValue = this.props.value;
		}



		this.state = {
			showRmk: false,
			showNQ: false,
			pCodesToShow: defaultPCodesToShow,
			value: nowValue
		};
		console.log("Value at end of constructor: ", this.state.value);

		this.handleValueChange = this.handleValueChange.bind(this);
	}


	


	handleValueChange = (row,col) => e => {  
		console.log("this.state.value: ", this.state.value);
		console.log("row: ", row, "col: ", col);
		console.log("e.target.value", e.target.value);
		let newVal = this.state.value.slice();
		console.log("newVal: ", newVal);
		newVal[row][col]=e.target.value;
		this.setState({ value: newVal }, () => {this.props.stateChangeHandler(this)});
	}



	componentWillMount() {
		
	}

	buildCell(rowRum, colNum) {

	}

	buildFirstColumn() {// builds first column of table -- the one that shows information data about the sample. ... also determines size of table... so useful in constructor.
		
		let sampleEventLocations = [];
		let numSets = this.props.getNumberOfSetsInCurrentSamplingEvent();
		let setType = this.props.getCurrentSetType(); //EDI, EWI, or OTHER

		for (let i = 0; i < numSets; i++) {
			let numSamps = this.props.getNumberOfSamplesInSet(String.fromCharCode(65 + i));
			let table_q_id = "set" + String.fromCharCode(65 + i) + "_samplesTable_" + setType;
			let setLocations = [];
			for (let k = 1; k <= numSamps; k++) {
				setLocations.push(this.props.getTableQuestionValue(table_q_id, 0, k));
			}
			sampleEventLocations.push(setLocations);
		}

		let firstColumn = [];
		for (let i = 0; i < sampleEventLocations.length; i++) {
			let setName = String.fromCharCode(65 + i)
			for (let k = 0; k < sampleEventLocations[i].length; k++) {
				let ending = '';
				if (setType!=='OTHER') ending=" @ " + sampleEventLocations[i][k];
				firstColumn.push(setName + "-" + (k + 1) + ending );
			}
		}

		return firstColumn;
	}



	render() {
		const { classes } = this.props;
		let setType = this.props.getCurrentSetType();
		let firstColumn = this.buildFirstColumn();
	
		console.log(this.state.value);
		

		return (
			<React.Fragment>
				<Paper className={classes.root}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell className={classes.tableCell}>Set-Sample{(setType!=='OTHER') ? " @ Dist" : null}</TableCell>
								{this.state.pCodesToShow.map((header) => {
									return (
										<TableCell className={classes.tableCell} key={"Param_" + header}>{header}</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{firstColumn.map((col, rowNum) => {
								let realRowNum = rowNum+1;
								return (
									<TableRow key={col + realRowNum}>
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
												onChange={this.handleValueChange(realRowNum,realColNum)} />

												{/* METHOD CODE */}
												<select 
												id={pCode + "_mth_" + (realRowNum + 1)} 
												value={this.state.value[realRowNum][realColNum + 1]}
												onChange={this.handleValueChange(realRowNum,realColNum + 1)}
												>
													{mth_options[pCode].map(mthCode => <option key={"mth_row:"+realRowNum+"_col:"+realColNum+"opt:"+mthCode} value={mthCode}>{mthCode}</option>)}
												</select>

												{/* REMARK CODE */}
												<select 
												hidden={this.state.showRmk} 
												id={pCode + "Rmk_" + (realRowNum + 1)} 
												value={this.state.value[realRowNum][realColNum + 2]}
												onChange={this.handleValueChange(realRowNum,realColNum + 2)} >
													{Object.keys(rmk_options).map(key => <option  key={"rmk_row:"+realRowNum+"_col:"+realColNum+"opt:"+key} value={rmk_options[key]}>{key}</option>)}
												</select>

												{/* NULL QUALIFIER */}
												<select 
												hidden={this.state.showNQ} 
												id={pCode + "_nq_" + (realRowNum + 1)} 
												value={this.state.value[realRowNum][realColNum + 3]}
												onChange={this.handleValueChange(realRowNum,realColNum + 3)}>
													{Object.keys(nQ_options).map(key => <option key={"nq_row:"+realRowNum+"_col:"+realColNum+"opt:"+key} value={nQ_options[key]}>{key}</option>)}
												</select>
											</TableCell>
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
					<button onClick={(() => this.setState({ showNQ: !this.state.showNQ }))}>Toggle NQ</button>
					<button onClick={(() => this.setState({ showRmk: !this.state.showRmk }))}>Toggle Rmk</button>
				</Paper>
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