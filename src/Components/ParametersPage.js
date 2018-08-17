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
	"a": "planned measurement was not made",
	"b": "sample broken/spilled in shipment",
	"e": "required equipment not functional or available",
	"f": "sample discarded: improper filter used",
	"x": "result failed quality assurence review"
}

const rmk_options = {
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
	"P00061": ["G0011", "Q-EST", "QADCP", "QFLUM", "QIDIR", "QSCMM", "QSLPQ", "QSTGQ", "QTRAC", "QUNSP", "QVELO", "QVOLM", "QWEIR", "ZEROF"],  
	"P00010": ["G0004", "THM01", "THM02", "THM03", "THM07"],
	"P00020": ["G0005", "THM04", "THM05"],
	"P00065": ["ACOUS", "CLIP", "CSG", "ENCD", "ETG", "FLOAT", "G0012", "HWM", "INSD", "LPRNT", "MANO", "NCAC", "NCLZ", "NCRD", "NTRAN", "OTSD", "RP", "STAF1", "STAFF", "STRAN", "WWG"],
	"P00095": ["SC001", "SC003"],
	"P63675": ["TBD03", "TS028", "TS088", "TS089", "TS093", "TS094", "TS095", "TS096", "TS097", "TS099", "TS102", "TS103", "TS104", "TS105", "TS106", "TS108", "TS109", "TS110", "TS111", "TS112", "TS113", "TS114", "TS116", "TS117", "TS118", "TS120", "TS121", "TS122", "TS124", "TS126", "TS127", "TS128", "TS130", "TS131", "TS132", "TS133", "TS134", "TS135", "TS136", "TS137", "TS138", "TS158", "TS159", "TS160", "TS161", "TS162", "TS163", "TS164", "TS165", "TS166", "TS188"],
	"P63676": ["TS027", "TS090", "TS091", "TS092", "TS098", "TS100", "TS101", "TS107", "TS115", "TS116", "TS117", "TS119", "TS123", "TS125", "TS129", "TS141", "TS167", "TS168", "TS169", "TS192", "TS193", "TS196"],
	"P63680": ["TS031", "TS032", "TS034", "TS035", "TS036", "TS037", "TS038", "TS040", "TS041", "TS042", "TS043", "TS044", "TS047", "TS048", "TS049", "TS050", "TS053", "TS054", "TS055", "TS056", "TS057", "TS058", "TS059", "TS060", "TS061", "TS062", "TS063", "TS064", "TS065", "TS066", "TS067", "TS068", "TS069", "TS070", "TS071", "TS074", "TS075", "TS076", "TS078", "TS080", "TS081", "TS082", "TS084", "TS085", "TS086", "TS087", "TS145", "TS146", "TS147", "TS148", "TS149", "TS150", "TS151", "TS156", "TS173", "TS174", "TS175", "TS176", "TS177", "TS178", "TS189", "TS198", "TS208", "TS209", "TS213", "TS214", "TS216"],
	"P65225": ["TTUBE"],
	"P72196": ["SADVM", "UADVM", "V-EST", "VADCP", "VADV", "VELC", "VICE", "VIPAA", "VIPYG", "VOTT", "VPAA", "VPYG", "VRAD", "VTIME", "VTRNS", "VULT"]
}


class ParametersPage extends React.Component {
	constructor(props) {
		super(props);
		
		let startInArr = [];
		for (let i = 0; i < this.props.sampleEventLocations.length; i++) {

			
				startInArr = new Array(this.props.sampleEventLocations[i].length).fill("");

			
		}


		this.state = {
			showRmk: false,
			showNQ: false,
			pCodesToShow: ["P00010",
				"P00020",
				"P00061",
				"P00065",
				"P00095"],
			// inArr: [["v1", "v2", "v3", "v4", "v5", "v6", "v7", "C", "C", "C", "C", "C", "C", "C", ">", ">", ">", ">", ">", ">", ">", "E", "E", "E", "E", "E", "E", "E"]]
			inArr: startInArr
		};

	//	this.handleValueChange = this.handleValueChange.bind(this);
	}

	handleValueChange = (row,col) => e => {  
		console.log(row,col);
		console.log(e.target.value);
		let newVal = this.state.inArr.slice();
		newVal[row][col]=e.target.value;
		this.setState({ inArr: newVal });
	}



	componentDidMount() {
		this.props.appBarTextCB("Parameters");
	}

	buildCell(rowRum, colNum) {

	}

	render() {

		const { classes } = this.props;




		let firstColumn = [];
		let secondColumn = [];
		for (let i = 0; i < this.props.sampleEventLocations.length; i++) {
			let setName = String.fromCharCode(65 + i)
			for (let k = 0; k < this.props.sampleEventLocations[i].length; k++) {
				firstColumn.push(setName + "-" + (k + 1));
				secondColumn.push(this.props.sampleEventLocations[i][k]); //TODO: if the type is "OTHER", just remove this entirely...
			}
		}

		return (
			<React.Fragment>
				<Paper className={classes.root}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell className={classes.tableCell}>Set-Sample</TableCell>
								<TableCell className={classes.tableCell}>Distance</TableCell>
								{this.state.pCodesToShow.map((header) => {
									return (
										<TableCell className={classes.tableCell} key={"Param_" + header}>{header}</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{firstColumn.map((col, rowNum) => {
								return (
									<TableRow key={col + rowNum}>
										<TableCell className={classes.tableCell}>
											{col}
										</TableCell>
										<TableCell className={classes.tableCell}>
											{secondColumn[rowNum]}
										</TableCell>
										{this.state.pCodesToShow.map((pCode, colNum) => {
											return <TableCell key={pCode + rowNum} className={classes.tableCell}>
												{/* VALUE */}
												<input 
												id={pCode + "_val_" + rowNum + 1} 
												type="text" size={1} 
												placeholder="Value" 
												value={this.state.inArr[0][colNum]} 
												onChange={this.handleValueChange(rowNum,colNum)} />

												{/* METHOD CODE */}
												<select id={pCode + "_mth_" + (rowNum + 1)} value={this.state.inArr[0][colNum + pCodes.length]}>
													{mth_options[pCode].map(mthCode => <option value={mthCode}>{mthCode}</option>)}
												</select>

												{/* REMARK CODE */}
												<select hidden={this.state.showRmk} id={pCode + "Rmk_" + (rowNum + 1)} value={this.state.inArr[0][colNum + (pCodes.length * 2)]}>
													{Object.keys(rmk_options).map(key => <option value={rmk_options[key]}>{key}</option>)}
												</select>

												{/* NULL QUALIFIER */}
												<select hidden={this.state.showNQ} id={pCode + "_nq_" + (rowNum + 1)} value={this.state.inArr[0][colNum + (pCodes.length * 3)]}>
													{Object.keys(nQ_options).map(key => <option value={nQ_options[key]}>{key}</option>)}
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




ParametersPage.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(ParametersPage);