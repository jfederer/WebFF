import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import Question from '../Question';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { allQWDATAOptionalHeaders, allAddOnOpts_bedload, allAddOnOpts_bottom, allAddOnOpts_suspended } from '../../Utils/QuestionOptions';
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

var firstColumn = [];

class QWDATATable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value,
			dialogM2LOpen: false,
			dialogM2LValue: "",
			dialogAddOnOpen: false,
			dialogAddOnValue: [],
			rowAddOnOptions: {},
			headers: allQWDATAOptionalHeaders
		};

		this.dialogM2LTextChangeHandler = this.dialogM2LTextChangeHandler.bind(this);
		this.addOnChangeHandler = this.addOnChangeHandler.bind(this);
	};

	componentWillMount() {
		console.log("QWDATA CWM:");
		console.log("QWDATA CWM STATE: ", this.state);
		console.log("QWDATA CQM PROPS: ", this.props);




		let newValue = this.props.value.slice();

		// check that the Add-on analysis values are arrays
				let AddOnAnalysesIndex = newValue[0].indexOf("Add-on Analyses");
//		let needsArraysAdded = false;
		if(AddOnAnalysesIndex<0) { throw new Error("Add-on Analyses not found in header of QWDATA table")}
		for(let row=1; row<newValue.length; row++) {
			if(!Array.isArray(newValue[row][AddOnAnalysesIndex])) {
//				needsArraysAdded = true;
				newValue[row][AddOnAnalysesIndex]=[];
			}
		}

		//set the first column values to something correct
		let sampleEventLocations = [];
		let numSets = this.props.getNumberOfSetsInCurrentSamplingEvent();
		let setType = this.props.getCurrentSampleEventMethod(); //EDI, EWI, or OTHER

		for (let i = 0; i < numSets; i++) {
			let numSamps = this.props.getNumberOfSamplesInSet(String.fromCharCode(65 + i));
			let table_q_id = "set" + String.fromCharCode(65 + i) + "_samplesTable_" + setType;
			let setLocations = [];
			for (let k = 1; k <= numSamps; k++) {
				let location = 0;
				if(setType==="EWI") {
					location = this.props.getTableQuestionValue(table_q_id, 0, k);
				} else {
					location = this.props.getTableQuestionValue(table_q_id, "Dist from L bank", k);
				}

					
				
				setLocations.push(location);
			}
			sampleEventLocations.push(setLocations);
		}



		let firstColumn = [];

		
		for (let i = 0; i < sampleEventLocations.length; i++) {
			let setName = String.fromCharCode(65 + i)
			for (let k = 0; k < sampleEventLocations[i].length; k++) {
				let ending = '';
				if (sampleEventLocations[i][k] !== '') ending = " @ " + sampleEventLocations[i][k];
				firstColumn.push(setName + "-" + (k + 1) + ending);
			}
		}
		// push below the header
		firstColumn.unshift("Set-Sample @ Dist");

		console.log("FIRST COLUMN: ", firstColumn);

		let SetSampDistIndex = newValue[0].indexOf("Set-Sample @ Dist");
		let needsArraysAdded = false;
		if(SetSampDistIndex<0) { throw new Error("\'Set-Sample @ Dist\' not found in header of QWDATA table")}
		for(let row=1; row<newValue.length; row++) {
			if(!Array.isArray(newValue[row][SetSampDistIndex])) {
//				needsArraysAdded = true;
				newValue[row][SetSampDistIndex]=firstColumn[row];
			}
		}

//		if(needsArraysAdded) {
			this.setState({value:newValue});
	//		return;
	//	}

		console.log("CWM done");

	}

	componentDidMount() {
		// console.log("CDM: ");
		// console.log("QWDATA CDM: ", this.props);
	}

	handleM2LClickOpen = (row, col) => {
		this.setState({ dialogM2LOpen: true, dialogM2LValue: this.state.value[row][col], curRow: row, curCol: col });
	};

	handleAddOnClickOpen = (row, col) => {
		// console.log(row, " x ", col);
		let addOnOpts = {};
		//load up addOnOpts 
		let sedType = this.props.getQuestionValue("sedimentType");
		switch (sedType) {
			case "bedload": Object.assign(addOnOpts, allAddOnOpts_bedload); break;
			case "bottom": Object.assign(addOnOpts, allAddOnOpts_bottom); break;
			default: Object.assign(addOnOpts, allAddOnOpts_suspended);
			// case "bedload": addOnOpts = allAddOnOpts_bedload; break;
			// case "bottom": addOnOpts = allAddOnOpts_bottom; break;
			// default:  addOnOpts = allAddOnOpts_suspended;
		}
		// console.log("addOnOpts (base):", addOnOpts);

		// get what set name we are in from the front of the row
		let setName = this.state.value[row][0].split("-")[0];
		// console.log("setName:", setName);

		// combined with the sediment type
		let analysesQ_id = "set" + setName + "_AnalysedFor_" + sedType;
		// console.log("analysesQ_id:", analysesQ_id);

		// will get us the question we need ....
		let alreadyDoing = this.props.getQuestionValue(analysesQ_id);
		// console.log("alreadyDoing:", alreadyDoing);

		// ...to 'subtract' from the list of options
		for (let i = 0; i < alreadyDoing.length; i++) {
			Object.keys(addOnOpts).map((key) => {
				if (addOnOpts[key] === alreadyDoing[i]) {
					delete addOnOpts[key];
				}
			})
		}
		// console.log("addOnOpts (filtered):", addOnOpts);

		this.setState({ dialogAddOnOpen: true, rowAddOnOptions: addOnOpts, dialogAddOnValue: this.state.value[row][col], curRow: row, curCol: col });
	};


	handleM2LSave = () => {
		let newVal = this.state.value.slice();
		newVal[this.state.curRow][this.state.curCol] = this.state.dialogM2LValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this) });
		this.handleClose();
	}

	handleAddOnSave = () => {
		// console.log(this.state.curRow, " x ", this.state.curCol);
		// console.log(this.state.value);
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


	handleValueChange = (row, col) => e => {
		//  console.log("this.state.value: ", this.state.value);
		//  console.log("row: ", row, "col: ", col);
		//  console.log("e", e);
		//  console.log("e.state.value", e.state.value);
		let newVal = this.state.value.slice();
		//  console.log("newVal: ", newVal);
		newVal[row][col] = e.state.value;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this) });
	}

	render() {
		if (!this.props.globalState.curSamplingEventName) {
			return <React.Fragment></React.Fragment>;  //no event name event loaded, just return
		}

		const { classes } = this.props;
		// console.log("QWDATA Render props.value: ", this.props.value);
		// console.log("QWDATA Render state: ", this.state);
		let classlessProps = this.props;
		delete classlessProps[classes];

		
	

		return (
			<React.Fragment>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							{Object.keys(this.state.headers).map((headerKey) => {
								let headerValue = this.state.headers[headerKey];
								let defaultValue = null;
								if (headerValue) {
									defaultValue = this.props.getQuestionValue(this.state.headers[headerKey]);
								}

								return (
									<TableCell className={classes.tableCell} key={"QWDATA_" + headerKey} >
										{headerKey}
										{defaultValue?<br />:null}
										{defaultValue
											? "("+defaultValue+")"
											: null}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.value.map((row, rowNum) => {
							if (rowNum === 0) {
								return null;
							}
							let realRowNum = rowNum + 1;
							return (
								<TableRow key={"ROW:" + realRowNum}>
									{Object.keys(this.state.headers).map((headerKey, colNum) => {
										let Q;
										let keyText = "QWDATA_row:" + rowNum + "_col:" + colNum;
										if (this.state.headers[headerKey] === null) {
											switch (headerKey) {
												case "Set-Sample @ Dist":
													Q = this.state.value[rowNum][colNum];
													break;
												case "Add-on Analyses":
													Q = <Button key={keyText} onClick={() => this.handleAddOnClickOpen(rowNum, colNum)}>{
														this.state.value[rowNum][colNum] === "" || this.state.value[rowNum][colNum].length === 0
															? "Add"
															: this.state.value[rowNum][colNum].join(",")}
													</Button>
													break;
												case "M2Lab":
													Q = <Button key={keyText} onClick={() => this.handleM2LClickOpen(rowNum, colNum)}>{
														this.state.value[rowNum][colNum] === ""
															? "Add"
															: "Edit"}
													</Button>;
													break;
												case "Sample Time":
													Q = <Question {...this.classlessProps}
														label=""
														id={keyText}
														key={keyText}
														type="TimeInput"
														stateChangeHandler={this.handleValueChange(rowNum, colNum)}
														// value={timeColumn[rowNum]}
														value={this.state.value[rowNum][colNum]}
													/>
													let thisSampleDescript = this.state.value[rowNum][0]
													//console.log("thisSampleDescript: ", thisSampleDescript);
													let thisSetName = thisSampleDescript.split("-")[0];
													//console.log("thisSetName ", thisSetName);
													let thisSampleNum = thisSampleDescript.split("-")[1].split(" @")[0];
													//console.log("thisSampleNum ", thisSampleNum);
													
													
													break;
											}
										} else {
											//console.log(this.state.headers[headerKey]);
											//console.log(this);
											let motherQuestion = this.props.getQuestionData(this.state.headers[headerKey]);
											//console.log(motherQuestion);

											Q = <Question {...this.classlessProps}
												label={null}
												type="DropDown"
												id={keyText}
												key={keyText}
												options={motherQuestion.options}
												includeBlank={true}
												stateChangeHandler={this.handleValueChange(rowNum, colNum)}
												value={this.state.value[rowNum][colNum]}
											/>
										}







										return (
											<TableCell key={"row:" + realRowNum + "_col:" + colNum} className={classes.tableCell}>{Q}</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
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
		);
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




	// buildRow(curRow, row) { //FUTURE:  build even the text questions as sub questions... auto-generating them
	// 	const { classes } = this.props;
	// 	console.log("QWDATA PROPS: ", this.props);
	// 	return <TableRow key={this.props.id + "_row_" + row}>
	// 		{curRow.map((cellContent, col) => {
	// 			let DEBUG = false;
	// 			let subQkey = this.props.id + "_row:" + row + "_col:" + col;
	// 			let classlessProps = delete this.props[classes]; // need to delete classes so they don't get passed to children
	// 			let adHocProps = { ...classlessProps, id: subQkey, type: "Text", label: "", value: cellContent }
	// 			// let adHocProps = { id: subQkey, type: "Text", label: "", value: cellContent }
	// 			let cellQuestion = null;

	// 			if (this.props.value[0][col] === "M2Lab" && row !== 0) {
	// 				cellQuestion = <Button onClick={() => this.handleM2LClickOpen(row, col)}>{this.props.value[row][col] === "" ? "Add" : "Edit"}</Button>
	// 			} else if (this.props.value[0][col] === "Add-on Analyses" && row !== 0) {
	// 				cellQuestion = <Button onClick={() => this.handleAddOnClickOpen(row, col)}>{this.props.value[row][col] === "" || this.props.value[row][col].length === 0 ? "Add" : this.props.value[row][col].join(",")}</Button>
	// 			} else {
	// 				// just text could either be a header (whereby it should NOT become a question)
	// 				// or it needs to be a text question in the table
	// 				if ((col === 0 && this.props.rowHeaders) || (row === 0 && this.props.colHeaders)) {
	// 					cellQuestion = <div className={classes.header}>{cellContent}</div>
	// 				} else {

	// 					// pull data from other pages and build this as a drop down question





	// 					cellQuestion = <Question {...adHocProps} size={this.props.colSizes[col]} globalState={this.props.globalState} stateChangeHandler={this.handleTableQuestionChange} value="BLah" />
	// 				}
	// 				// }
	// 			}
	// 			return (
	// 				<TableCell className={classes.tableCell} key={this.props.id + "_row:" + row + "_col:" + col}>
	// 					{cellQuestion}
	// 				</TableCell>
	// 			)
	// 		})}


	// 	</TableRow>
	// }