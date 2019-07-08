import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
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
import { getKeyFromValue } from '../../Utils/Utilities';
import { getQuestionValue, getDescriptiveColumnForTable } from '../../Utils/QuestionUtilities';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';


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


var preRequisiteInfo = {
	descriptiveColumn: null
}

// getDescriptiveColumnForTable={() => getDescriptiveColumnForTable(currentEventID)}
// getQuestionValue={(QID)=>getQuestionValue(currentEventID, QID)}
// getQuestionData={(QID)=>{return defaultQuestionsData[QID]}}

class QWDATATable extends React.Component {
	
	constructor(props) {
		super(props);
		let { currentEventID } = this.props;
		

		console.log("QWDATA TABLE CONSTRUCTOR");

		let nowValue = [];
		// let startingPCodes = [];
		if (typeof this.props.value === 'undefined' || this.props.value === null) {// if no value handed
			console.log("Handed null/undefined value, building blank QWDATA Table");

			nowValue = this.createInitialValueFromScratch();

		}
		else { // if a value was sent
			// need to ensure the value has the right number of rows
			console.log("Handed existing value: ", this.props.value);
			nowValue = this.verifyPassedValue();
		}

		console.log("QWDATA now value post : ", nowValue);

		let rdy = true;  
		Object.keys(preRequisiteInfo).forEach((key) => {  //TODO: unsure the purpose of prerequiste
			if (preRequisiteInfo[key] === null) {
				rdy = false;
			}
		})


		this.state = {
			dialogM2LOpen: false,
			dialogM2LValue: "",
			dialogAddOnOpen: false,
			dialogAddOnValue: [],
			rowAddOnOptions: {},
			readyToDisplay: rdy
		};

		console.log("Done with QWDATA TABLE constructor")
		this.props.stateChangeHandler(currentEventID, this.props.id, nowValue);
	};


	createInitialValueFromScratch = () => {
		let nowValue = [];

		// build header from scratch
		let headerRow = [];
		Object.keys(allQWDATAOptionalHeaders).forEach((header) => {
			headerRow.push(header);
		});
		nowValue.push(headerRow);

		// build default values (blanks)
		preRequisiteInfo.descriptiveColumn = getDescriptiveColumnForTable(this.props.currentEventID); // this gives us number of rows too

		for (let i = 1; i < preRequisiteInfo.descriptiveColumn.length; i++) {
			let emptyRow = new Array(headerRow.length - 1).fill("");
			emptyRow.unshift(preRequisiteInfo.descriptiveColumn[i]);
			nowValue.push(emptyRow);
		}

		// make the Add-on analysis values arrays
		let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
		if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
		for (let row = 1; row < nowValue.length; row++) { // skip header row
			if (!Array.isArray(nowValue[row][AddOnAnalysesIndex])) {
				nowValue[row][AddOnAnalysesIndex] = [];
			}
		}

		// fill out the estimated time, if possible  // TODO: FIXME: 

		// this.insertEstimatedTime(nowValue); //TODO: estimate time

		return nowValue;
	}

	verifyPassedValue = () => {
		nowValue = [];
		// build new header row, note, the header row should still be correct.
		nowValue.push(_.cloneDeep(this.props.value[0])); // 

		// build rows based on existing values
		preRequisiteInfo.descriptiveColumn = getDescriptiveColumnForTable(currentEventID); // preRequisiteInfo.descriptiveColumn will now be the authoritative new [0] element in each row
		// console.log("NEW FIRST COLUMN: ", preRequisiteInfo.descriptiveColumn);
		for (let newRowNum = 1; newRowNum < preRequisiteInfo.descriptiveColumn.length; newRowNum++) { // start at 1 to skip the header row
			// console.log("Looking for...", preRequisiteInfo.descriptiveColumn[newRowNum]);
			//look in props.value for existing matching row
			let matchingOldRow = -1;
			for (let oldRow = 1; oldRow < this.props.value.length; oldRow++) {
				// console.log("against..." + this.props.value[oldRow][0]);
				if (preRequisiteInfo.descriptiveColumn[newRowNum] === this.props.value[oldRow][0]) {
					// console.log("MATCH!");

					matchingOldRow = oldRow;
					break;
				}
			}

			let newRow = [];
			if (matchingOldRow !== -1) {
				newRow = _.cloneDeep(this.props.value[matchingOldRow]);
			} else {
				newRow = new Array(this.props.value[0].length - 1).fill("");
				newRow.unshift(preRequisiteInfo.descriptiveColumn[newRowNum]);
			}

			// ensure add-on analysis is an array
			let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
			if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
			if (!Array.isArray(newRow[AddOnAnalysesIndex])) {
				newRow[AddOnAnalysesIndex] = [];
			}

			nowValue.push(newRow);
		}
		return nowValue;
	}

	// componentWillMount() {
	// 	console.log("QDWATAA CWM");
	// }

	// componentDidMount() {
	// 	console.log("QWDATA: CDM");
	// 	console.log("CDM: SCH: ", this.state.value);
	// 	this.props.stateChangeHandler(this.state.value);
	// }

	insertEstimatedTime(value) {
		let etc = this.getEstimatedTimeColumn();
		let SampleTimeIndex = value[0].indexOf("Sample Time");
		if (SampleTimeIndex < 0) { throw new Error("Sample Time not found in header of QWDATA table") }
		for (let row = 1; row < value.length; row++) { // skip header row
			if (!Array.isArray(value[row][SampleTimeIndex])) {
				value[row][SampleTimeIndex] = etc[row];
			}
		}
		return value;
	}

	getEstimatedTimeColumn() {
		let estimatedTimeColumn = new Array(this.props.getDescriptiveColumnForTable().length).fill("");
		let numberOfSets = this.props.getNumberOfSetsInCurrentSamplingEvent();

		for (let setNum = 0; setNum < numberOfSets; setNum++) {
			let thisSetName = String.fromCharCode(65 + setNum);
			let numberOfSamplesInSet = this.props.getNumberOfSamplesInSet(thisSetName);
			let startTime = this.props.getQuestionValue("set" + thisSetName + "_StartTime");
			let endTime = this.props.getQuestionValue("set" + thisSetName + "_EndTime");
			let ai = !this.props.getQuestionValue("set" + thisSetName + "_samplesComposited");
			let startDateTime = new Date("January 1, 2000 " + startTime)
			let endDateTime = new Date("January 1, 2000 " + endTime)
			let msElapsed = Math.abs(endDateTime - startDateTime);
			let msBetweenSamples = msElapsed / (numberOfSamplesInSet - 1);

			let totalNumberOfSamplesInPreviousSets = 0;
			for (let i = setNum; i > 0; i--) {
				// if this set was a composite, it was only one line in the QWDATA Table
				let previousSetName = String.fromCharCode(i + 64);
				let previousSetAI = !this.props.getQuestionValue("set" + previousSetName + "_samplesComposited");
				totalNumberOfSamplesInPreviousSets += previousSetAI ? this.props.getNumberOfSamplesInSet(previousSetName) : 1;
			}

			for (let sampNum = 0; sampNum < (ai ? numberOfSamplesInSet : 1); sampNum++) {
				let QWDATARowNum = sampNum + 1 + totalNumberOfSamplesInPreviousSets;
				let timeSinceStart = (sampNum * msBetweenSamples);
				let d = new Date(startDateTime.getTime() + timeSinceStart);
				estimatedTimeColumn[QWDATARowNum] = startTime && endTime
					? ('0' + d.getHours()).slice(-2) + ":" + ('0' + (d.getMinutes())).slice(-2)
					: "";
			}
		}
		return estimatedTimeColumn;
	}


	handleM2LClickOpen = (row, col) => {
		this.setState({ dialogM2LOpen: true, dialogM2LValue: this.props.value[row][col], curRow: row, curCol: col });
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
		let setName = this.props.value[row][0].split("-")[0];
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
				return null;
			})
		}
		// console.log("addOnOpts (filtered):", addOnOpts);

		this.setState({ dialogAddOnOpen: true, rowAddOnOptions: addOnOpts, dialogAddOnValue: this.props.value[row][col], curRow: row, curCol: col });
	};


	handleM2LSave = () => { //TOOD: combine all handlers just 'getting' the value separately
		let newVal = this.props.value.slice();
		newVal[this.state.curRow][this.state.curCol] = this.state.dialogM2LValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this.props.value) });
		this.handleClose();
	}

	handleAddOnSave = () => {
		// console.log(this.state.curRow, " x ", this.state.curCol);
		// console.log(this.state.value);
		let newVal = this.props.value.slice();
		newVal[this.state.curRow][this.state.curCol] = this.state.dialogAddOnValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this.props.value) });
		this.handleClose();
	}

	handleClose = () => {
		this.setState({ dialogM2LOpen: false, dialogAddOnOpen: false });
	};

	dialogM2LTextChangeHandler = (e) => {
		this.setState({ dialogM2LValue: e.target.value }, () => { this.props.stateChangeHandler(this.props.value) });
	}

	addOnChangeHandler = (mcq) => {
		this.setState({ dialogAddOnValue: mcq.props.value });
	}

	handleValueChange = (row, col) => (eventID, QID, value) => {
		console.log("QWDATA: handleValueChange (", row, ", ", col, ")", eventID, QID, value, ")");

		console.log("QWDATA: handleValueChange: this.state.value: ", this.props.value);
		//  console.log("row: ", row, "col: ", col);
		//  console.log("e", e);
		//  console.log("e.state.value", e.state.value);
		let newVal = _.cloneDeep(this.props.value); //.slice();
		//  console.log("newVal: ", newVal);
		newVal[row][col] = value;

		console.log("QWDATA: setting State (newVal): ", newVal);
		// this.setState({ value: newVal }, () => {
		// console.log("QWDATA: handleValueChange setState Callback: ", newVal);
		this.props.stateChangeHandler(newVal)
		//  });
	}

	handleEstimateClick = (e) => {
		console.log("QWDATA: handleEstimateClick");

		var r = window.confirm("Are you sure you want to overwrite current values in the Sample Time column with estimated values?");
		if (r !== true) {
			return;
		}

		let newVal = this.insertEstimatedTime(this.props.value);
		let SampleTimeIndex = newVal[0].indexOf("Sample Time");
		if (SampleTimeIndex < 0) { throw new Error("Sample Time not found in header of QWDATA table") }
		let etc = this.getEstimatedTimeColumn();

		for (let row = 1; row < newVal.length; row++) { // skip header row
			newVal[row][SampleTimeIndex] = etc[row];
		}
		this.setState({ value: newVal }, () => {
			this.props.stateChangeHandler(this.props.value);
		});
	}




	render() {
		const { classes } = this.props;
		console.log("QWDATA Render props: ", this.props);

		// console.log("QWDATA Render state: ", this.state);
		let classlessProps = this.props;
		delete classlessProps[classes];

		if (typeof this.props.value === 'undefined' || this.props.value === null) {
			console.log("Null render");
			return null;
		} 

		return (
			 this.state.readyToDisplay 
				? <React.Fragment>
					<br></br>
					<Typography style={{ flex: 1 }}>Ensure unique sample times.   All samples will get codes in parenthesis (values pulled from FieldForm page), unless changed here.</Typography>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								{this.props.value[0].map((headerKey) => {
									let headerValue = allQWDATAOptionalHeaders[headerKey];
									// console.log(headerKey +"="+headerValue);

									let defaultValue = null;
									let displayValue = null;
									if (headerValue) {
										let qidForDefaultValue = headerValue;
										console.log("qidForDefaultValue: ", qidForDefaultValue);
										defaultValue = this.props.getQuestionValue(qidForDefaultValue);
										console.log("Default Value: ", defaultValue);
										if (defaultValue) {
											let QD = this.props.getQuestionData(qidForDefaultValue);
											displayValue = getKeyFromValue(QD.options, defaultValue);
										}
									}

									if (headerKey === "Sample Date") {
										let sdArr = this.props.getQuestionValue("sampleDate").split("-");
										displayValue = sdArr[1] + "/" + sdArr[2] + "/" + sdArr[0];
									}
									if (headerKey === "Sample Time") {
										displayValue = <button onClick={this.handleEstimateClick}>Estimate</button>;
									}

									return (
										<TableCell className={classes.tableCell} key={"QWDATA_" + headerKey} >
											{headerKey}
											{displayValue ? <br /> : null}
											{displayValue
												? <React.Fragment>({displayValue})</React.Fragment>
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
										{this.props.value[0].map((headerKey, colNum) => {
											let Q;
											let keyText = "QWDATA_row:" + rowNum + "_col:" + colNum;   //TODO: this is getting passed as the raw QID for some reason
											// console.log("this.state.value[0]", this.state.value[0]);
											// console.log("headerKey", headerKey);


											if (allQWDATAOptionalHeaders[headerKey] === null) {
												switch (headerKey) {
													case "Set-Sample @ Dist":
														Q = this.props.value[rowNum][colNum];
														break;
													case "Add-on Analyses":
														Q = <Button key={keyText} onClick={() => this.handleAddOnClickOpen(rowNum, colNum)}>{
															this.props.value[rowNum][colNum] === "" || this.props.value[rowNum][colNum].length === 0
																? "Add"
																: this.props.value[rowNum][colNum].join(",")}
														</Button>
														break;
													case "M2Lab":
														Q = <Button key={keyText} onClick={() => this.handleM2LClickOpen(rowNum, colNum)}>{
															this.props.value[rowNum][colNum] === ""
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
															alternateChangeHandler={this.handleValueChange(rowNum, colNum)}
															value={this.props.value[rowNum][colNum]}
														/>
														break;
													case "Sample Date":
														Q = <Question {...this.classlessProps}
															label=""
															id={keyText}
															key={keyText}
															type="DateInput"
															alternateChangeHandler={this.handleValueChange(rowNum, colNum)}
															value={this.props.value[rowNum][colNum]}
														/>
														break;
													default: throw new Error(headerKey + " case not handled in QWDATA table");
												}
											} else {
												let motherQuestion = this.props.getQuestionData(allQWDATAOptionalHeaders[headerKey]); //TODO: should ensure this comes back with a question that has 'options' or things go loony

												Q = <Question {...this.classlessProps}
													label={null}
													type="DropDown"
													id={keyText}
													key={keyText}
													options={motherQuestion.options}
													includeBlank={true}
													alternateChangeHandler={this.handleValueChange(rowNum, colNum)}
													value={this.props.value[rowNum][colNum]}
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
										alternateChangeHandler={this.addOnChangeHandler}
									/>}


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
				: <Typography>You have not yet set the required items to render this table.</Typography>
		);
	}
}

// QWDATATable.propTypes = {
// 	classes: PropTypes.object,
// 	validator: PropTypes.func,
// 	stateChangeHandler: PropTypes.func,
// 	key: PropTypes.string,
// 	id: PropTypes.string.isRequired,
// 	label: PropTypes.string,
// 	placeholder: PropTypes.string,
// 	XMLTag: PropTypes.string,
// 	type: PropTypes.oneOf(["QWDATATable"]).isRequired

// 	//TODO: custom validator prop types https://reactjs.org/docs/typechecking-with-proptypes.html
// 	// (ie: "if dropDown... select_options prop(array or strings) is required")
// 	//TODO: expand the 'options' to be objectOf, etc.  ie: make sure it's formatted right.

// };



const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		defaultQuestionsData: state.Questions.questionsData,
	}
}


const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(QWDATATable));


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