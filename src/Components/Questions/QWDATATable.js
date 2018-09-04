import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import Question from '../Question';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
//this.state.value always contains the up-to-date question values/answers.
//values with 'subQuestion' will need to be traced through LS to the sub question value


const styles = theme => ({
	table: {
		width: "100%",
		//	backgroundColor: "#911"
	},
	tableCell: {
		padding: 5,
		flexShrink: 0,
	},

});


const allAddOnOpts_bedload = {
	"Full size fractions": "Z"
}

const allAddOnOpts_bottom = {
	"Sand-fine break": "SF",
	"Loss-on-ignition": "LOI",
	"Sand Analysis": "SA",
	"Full size fractions": "Z"
}

const allAddOnOpts_suspended = {
	"Sand-fine break": "SF",
	"Sand Analysis": "SA",
	"Loss-on-ignition": "LOI",
	"Full size fractions": "Z"
}

class QWDATATable extends React.Component {
	constructor(props) {
		super(props);

		let numRows = this.props.value.length;
		let numCols = 1; // tables with less than 1 column are not allowed
		this.props.value.forEach(function (row) {
			if (row.length > numCols) {
				numCols = row.length;
			}
		});
		//console.log("table mad: rows: ", numRows, " cols: ", numCols);

		let emptyTable = [];
		for (var i = 0; i < numRows; i++) {
			emptyTable.push(Array(numCols).fill("Def"));
		}

		if (this.props.value != null) {
			this.props.value.map((row, rowNum) => {
				row.map((element, colNum) => {
					emptyTable[rowNum][colNum] = element;
					return null;
				});
				return null;
			});
		}

		this.state = {
			value: emptyTable,
			dialogM2LOpen: false,
			dialogM2LValue: "",
			dialogAddOnOpen: false,
			dialogAddOnValue: [],
			rowAddOnOptions: {}
		};

		this.handleTableQuestionChange = this.handleTableQuestionChange.bind(this);
		this.dialogM2LTextChangeHandler = this.dialogM2LTextChangeHandler.bind(this);
		this.addOnChangeHandler = this.addOnChangeHandler.bind(this);
	};

	componentWillMount() {
		//		console.log("CWM: ", this.state.value)


	}

	handleM2LClickOpen = (row, col) => {
		this.setState({ dialogM2LOpen: true, dialogM2LValue: this.state.value[row][col], curRow: row, curCol: col });
	};

	handleAddOnClickOpen = (row, col) => {
		console.log(row, " x ", col);
		let addOnOpts = {};
		//load up addOnOpts 
		let sedType = this.props.getQuestionValue("sedimentType");
		switch (sedType) {
			case "bedload": Object.assign(addOnOpts, allAddOnOpts_bedload); break;
			case "bottom": Object.assign(addOnOpts, allAddOnOpts_bottom); break;
			default:  Object.assign(addOnOpts, allAddOnOpts_suspended);
			// case "bedload": addOnOpts = allAddOnOpts_bedload; break;
			// case "bottom": addOnOpts = allAddOnOpts_bottom; break;
			// default:  addOnOpts = allAddOnOpts_suspended;
		}
		console.log("addOnOpts (base):", addOnOpts);

		// get what set name we are in from the front of the row
		let setName = this.state.value[row][0].split("-")[0];
		console.log("setName:", setName);

		// combined with the sediment type
		let analysesQ_id = "set"+setName+"_AnalysedFor_"+sedType;
		console.log("analysesQ_id:", analysesQ_id);

		// will get us the question we need ....
		let alreadyDoing = this.props.getQuestionValue(analysesQ_id);
		console.log("alreadyDoing:", alreadyDoing);
		
		// ...to 'subtract' from the list of options
		for(let i =0; i<alreadyDoing.length; i++) {
			Object.keys(addOnOpts).map((key)=> {
				if(addOnOpts[key]===alreadyDoing[i]) {
					delete addOnOpts[key];
				}
			})
		}
		console.log("addOnOpts (filtered):", addOnOpts);

		this.setState({ dialogAddOnOpen: true, rowAddOnOptions: addOnOpts, dialogAddOnValue: this.state.value[row][col], curRow: row, curCol: col });
	};


	handleM2LSave = () => {
		let newVal = this.state.value.slice();
		newVal[this.state.curRow][this.state.curCol] = this.state.dialogM2LValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this) });
		this.handleClose();
	}

	handleAddOnSave = () => {
		console.log(this.state.curRow, " x ", this.state.curCol);
		console.log(this.state.value);
		let newVal = this.state.value.slice();
		newVal[this.state.curRow][this.state.curCol] = this.state.dialogAddOnValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this) });
		this.handleClose();
	}

	handleClose = () => {
		this.setState({ dialogM2LOpen: false, dialogAddOnOpen: false });
	};

	dialogM2LTextChangeHandler = (e) => {
		this.setState({ dialogM2LValue: e.target.value }, () => { this.props.stateChangeHandler(this) });
	}

	addOnChangeHandler = (mcq) => {
		this.setState({ dialogAddOnValue: mcq.state.value });
	}




	handleTableQuestionChange(textSubQuestion) {

		let DEBUG = false;
		if (DEBUG) console.log("handleTableQuestionChange: textSubQuestion: ", textSubQuestion);
		//TODO: textSubQuestion.state.value is correct at this point... it's row and col is correct as well.  use row/col to edit the double-array on this.state.value and then send back to the this.props.stateChangeHandler to write it to LS
		const { id } = textSubQuestion.props;
		// console.log("textSubQuestion", textSubQuestion);
		let questionRow = id.substring(id.indexOf("row:") + 4, id.indexOf("_col:"));
		let questionCol = id.substring(id.indexOf("col:") + 4);
		let questionVal = textSubQuestion.state.value;
		if (DEBUG) console.log("questionVal: ", questionVal);
		if (DEBUG) console.log("questionRow: ", questionRow);
		if (DEBUG) console.log("questionCol: ", questionCol);
		let tempTableValue = this.props.value;
		tempTableValue[questionRow][questionCol] = questionVal;
		//console.log(tempTableValue);
		this.setState({ value: tempTableValue }, () => { this.props.stateChangeHandler(this) });
	}


	buildFirstColumn() {// builds first column of table -- the one that shows information data about the sample. ... also determines size of table... so useful in constructor.

		let sampleEventLocations = [];
		let numSets = this.props.getNumberOfSetsInCurrentSamplingEvent();
		let setType = this.props.getCurrentSampleEventMethod(); //EDI, EWI, or OTHER

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
				if (setType !== 'OTHER') ending = " @ " + sampleEventLocations[i][k];
				firstColumn.push(setName + "-" + (k + 1) + ending);
			}
		}

		return firstColumn;
	}


	buildRow(curRow, row) { //FUTURE:  build even the text questions as sub questions... auto-generating them
		const { classes } = this.props;
		return <TableRow key={this.props.id + "_row_" + row}>
			{curRow.map((cellContent, col) => {
				let DEBUG = false;
				let subQkey = this.props.id + "_row:" + row + "_col:" + col;
				let classlessProps = delete this.props[classes]; // need to delete classes so they don't get passed to children
				let adHocProps = { ...classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }
				// let adHocProps = { id: subQkey, type: "Text", label: "", value: cellContent }
				let cellQuestion = null;

				if (this.props.value[0][col] === "M2Lab" && row !== 0) {
					cellQuestion = <Button onClick={() => this.handleM2LClickOpen(row, col)}>{this.props.value[row][col] === "" ? "Add" : "Edit"}</Button>
				} else if (this.props.value[0][col] === "Add-on Analyses" && row !== 0) {
					console.log("val: \'",  this.props.value[row][col], "\'");
					cellQuestion = <Button onClick={() => this.handleAddOnClickOpen(row, col)}>{this.props.value[row][col] === "" || this.props.value[row][col].length===0 ? "Add" : this.props.value[row][col].join(",")}</Button>
				} else {

						// just text could either be a header (whereby it should NOT become a question)
						// or it needs to be a text question in the table
						if ((col === 0 && this.props.rowHeaders) || (row === 0 && this.props.colHeaders)) {
							cellQuestion = <div className={classes.header}>{cellContent}</div>
						} else {
							cellQuestion = <Question {...adHocProps} size={this.props.colSizes[col]} globalState={this.props.globalState} stateChangeHandler={this.handleTableQuestionChange} value="BLah"/>
						}
					// }
				}
				return (
					<TableCell className={classes.tableCell} key={this.props.id + "_row:" + row + "_col:" + col}>
						{cellQuestion}
					</TableCell>
				)
			})}


		</TableRow>
	}


	render() {
		//FUTURE: Let's build the question as needed rather than re-render every time?  (right now, the entire question gets rebuilt upon a single keypress)
		const { classes } = this.props;
	//	console.log(this.props);
		let tableValues = this.props.value;

		// build the JSX tableRows based on will-mount-calculated tableValues
		let tableRows = [];
		let tableHeaderRow;

		tableValues.forEach((curRow, row) => {
			let thisRow = this.buildRow(curRow, row);
			if (this.props.colHeaders && row === 0) {
				tableHeaderRow = thisRow;
			} else {
				tableRows.push(thisRow);
			}
		});

		let tableHeader = tableHeaderRow ?
			<TableHead key={this.props.id + "_tableHead"}>{tableHeaderRow}</TableHead> :
			null;

		let tableBody = <TableBody>{tableRows}</TableBody>;

	//	console.log("Dialog Add On value: ", this.state.dialogAddOnValue);

		return <React.Fragment>
			<Table key={this.props.id + "_table"} className={classes.table}>
				{/* {colGroup} */}
				{tableHeader}
				{tableBody}
			</Table>
			<Dialog
				open={this.state.dialogM2LOpen}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
			><form className="commentForm" onSubmit={this.handleM2LSave}>
					<DialogTitle id="form-dialog-title">Message To Lab</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Enter the message you'd like to send to the lab about this particular sample
				  </DialogContentText>
						<TextField
							autoFocus
							value={this.state.dialogM2LValue}
							onChange={this.dialogM2LTextChangeHandler}
							margin="dense"
							id="M2L_Dialog"
							label="Message To Lab"
							rows={5}
							fullWidth
							multiline
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
				  </Button>
						<Button onClick={this.handleM2LSave} color="primary">
							Save
				  </Button>
					</DialogActions>
				</form>
			</Dialog>

			<Dialog
				open={this.state.dialogAddOnOpen}
				onClose={this.handleClose}
				aria-labelledby="form-dialog-title"
			><form className="commentForm" onSubmit={this.handleAddOnSave}>
					<DialogTitle id="form-dialog-title">Add on Analyses</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Select the available add-on analyses you'd like to have done on this sample
				  </DialogContentText>
						{Object.keys(this.state.rowAddOnOptions).length === 0 && this.state.rowAddOnOptions.constructor === Object ?
						<Typography>There are no available add-on analyses for this sample</Typography> :
						<Question
							id="AddOnAnalyses"
							type="MultipleChoice"
							options={this.state.rowAddOnOptions}
							value={this.state.dialogAddOnValue}
							stateChangeHandler={this.addOnChangeHandler}
						/>}


						{/* //  {...allPropFuncs}  {...questionData} value={value} questionsValues={questionsValues} stateChangeHandler={changeHandler} globalState={_globalState} /> */}

					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
				  </Button>
						<Button onClick={this.handleAddOnSave} color="primary">
							Save
				  </Button>
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	}
}

QWDATATable.propTypes = {
	classes: PropTypes.object,
	validator: PropTypes.func,
	stateChangeHandler: PropTypes.func,
	key: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	XMLTag: PropTypes.string,
	type: PropTypes.oneOf(["QWDATATable"]).isRequired

	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
	// (ie: "if dropDown... select_options prop(array or strings) is required")
	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

};

export default withStyles(styles)(QWDATATable);