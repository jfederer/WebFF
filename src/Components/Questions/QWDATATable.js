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

import Typography from '@material-ui/core/Typography';
import { allQWDATAOptionalHeaders, allOpts, allAddOnOpts_bedload, allAddOnOpts_bottom, allAddOnOpts_suspended } from '../../Utils/QuestionOptions';
import { getKeyFromValue } from '../../Utils/Utilities';

import { getQuestionValue, getDescriptiveColumnForTable } from '../../Utils/QuestionUtilities';
import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import { SET_INFORMATION_IDENTIFIER } from '../../Constants/Config';
import TextFieldDialog from '../Dialogs/TextFieldDialog';
import MultipleChoiceDialog from '../Dialogs/MultipleChoiceDialog';
import { SAMPLE_TIME_HEADER, SAMPLE_DATE_HEADER, M2LAB_HEADER, DESCRIPTION_HEADER, ADD_ON_HEADER } from '../../Constants/Dictionary';
import { insertEstimatedTime, getEstimatedTimeColumn } from '../../Utils/CalculationUtilities';

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

export const createInitialQWDATAValue = (eventID) => {
	let initValue = [];

	// build header from scratch
	let headerRow = [];
	Object.keys(allQWDATAOptionalHeaders).forEach((header) => {
		headerRow.push(header);
	});
	initValue.push(headerRow);

	let descriptiveColumn = getDescriptiveColumnForTable(eventID); // this gives us number of rows too

	for (let i = 1; i < descriptiveColumn.length; i++) {
		let emptyRow = new Array(headerRow.length - 1).fill("");
		emptyRow.unshift(descriptiveColumn[i]);
		initValue.push(emptyRow);
	}

	// make the Add-on analysis values arrays
	let AddOnAnalysesIndex = initValue[0].indexOf(ADD_ON_HEADER);
	if (AddOnAnalysesIndex < 0) { throw new Error(ADD_ON_HEADER + " not found in header of QWDATA table") }
	for (let row = 1; row < initValue.length; row++) { // skip header row
		initValue[row][AddOnAnalysesIndex] = {};
	}

	// fill out the estimated time, if possible  // TODO: FIXME: 

	 insertEstimatedTime(eventID, initValue); //TODO: estimate time

	return initValue;
}

export const verifyPassedQWDATAValue = (eventID, value) => {
	let nowValue = [];
	// build new header row, note, the header row should still be correct.
	nowValue.push(_.cloneDeep(value[0])); // 

	// build rows based on existing values
	let descriptiveColumn = getDescriptiveColumnForTable(eventID); // preRequisiteInfo.descriptiveColumn will now be the authoritative new [0] element in each row
	// console.log("NEW FIRST COLUMN: ", preRequisiteInfo.descriptiveColumn);
	for (let newRowNum = 1; newRowNum < descriptiveColumn.length; newRowNum++) { // start at 1 to skip the header row
		// console.log("Looking for...", preRequisiteInfo.descriptiveColumn[newRowNum]);
		//look in props.value for existing matching row
		let matchingOldRow = -1;
		for (let oldRow = 1; oldRow < value.length; oldRow++) {
			// console.log("against..." + this.props.value[oldRow][0]);
			if (descriptiveColumn[newRowNum] === value[oldRow][0]) {
				// console.log("MATCH!");

				matchingOldRow = oldRow;
				break;
			}
		}

		let newRow = [];
		if (matchingOldRow !== -1) {
			newRow = _.cloneDeep(value[matchingOldRow]);
		} else {
			newRow = new Array(value[0].length - 1).fill("");
			newRow.unshift(descriptiveColumn[newRowNum]);
		}

		// ensure add-on analysis is an array
		let AddOnAnalysesIndex = nowValue[0].indexOf(ADD_ON_HEADER);
		if (AddOnAnalysesIndex < 0) { throw new Error(ADD_ON_HEADER + " not found in header of QWDATA table") }
		if (!Array.isArray(newRow[AddOnAnalysesIndex])) {
			newRow[AddOnAnalysesIndex] = [];
		}

		nowValue.push(newRow);
	}
	return nowValue;
}


class QWDATATable extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			dialogM2LOpen: false,
			dialogAddOnOpen: false,
			dialogAddOnValue: {},
			rowAddOnOptions: {}
		};

	};


	handleM2LClickOpen = (row, col) => {
		this.setState({
			dialogM2LOpen: true,
			dialogM2LValue: this.props.value[row][col],
			curRow: row,
			curCol: col
		});
	};

	handleAddOnClickOpen = (row, col) => {
		// console.log("handleAddOnClickOpen: (", row, ", ", col, ")");
		let addOnOpts = {};
		//load up addOnOpts 
		let sedType = this.props.getQuestionValue("sedimentType");
		switch (sedType) {
			case "bedload": Object.assign(addOnOpts, allAddOnOpts_bedload); break;
			case "bottom": Object.assign(addOnOpts, allAddOnOpts_bottom); break;
			default: Object.assign(addOnOpts, allAddOnOpts_suspended);
		}
		// console.log("addOnOpts (base):", addOnOpts);

		// get what set name we are in from the front of the row
		let setName = this.props.value[row][0].split("-")[0];
		// console.log("setName:", setName);

		// combined with the sediment type
		let analysesQID = "analysedFor_" + sedType;
		// console.log("analysesQ_id:", analysesQID);

		// will get us the question that tells us what's already been added to the entire set ....
		let alreadyDoing = getQuestionValue(this.props.currentEventID, SET_INFORMATION_IDENTIFIER + setName, analysesQID);
		// console.log("alreadyDoing:", alreadyDoing);

		// ...to 'subtract' from the list of options
		Object.keys(addOnOpts).forEach((key) => {
			if (alreadyDoing[key + "*"] === true) {  //TODO: adding the asterisk is a kludge, should be adding it more elegantly in the multi-choice question somehow using the questionOptions constants
				delete addOnOpts[key];
			}
		})

		// console.log("addOnOpts (filtered):", addOnOpts);

		this.setState({
			dialogAddOnOpen: true,
			rowAddOnOptions: addOnOpts,
			dialogAddOnValue: _.cloneDeep(this.props.value[row][col]),
			curRow: row,
			curCol: col
		});
	};


	handleCellValueSave = (cellValue) => {
		let newVal = this.props.value.slice();
		newVal[this.state.curRow][this.state.curCol] = cellValue;
		this.setState({ value: newVal }, () => { this.props.stateChangeHandler(this.props.value) });
		this.handleDialogsClose();
	}

	handleDialogsClose = () => {
		this.setState({ dialogM2LOpen: false, dialogAddOnOpen: false });
	};


	handleValueChange = (row, col) => (eventID, QID, value) => {
		console.log("QWDATA: handleValueChange (", row, ", ", col, ")", eventID, QID, value, ")");

		let newVal = _.cloneDeep(this.props.value);
		newVal[row][col] = value;

		this.props.stateChangeHandler(newVal)
	}

	handleEstimateClick = (e) => {  //TODO: allow overwrites vs no overwrites
		var r = window.confirm("Are you sure you want to overwrite current values in the " + SAMPLE_TIME_HEADER + " column with estimated values whever possible?");
		if (r !== true) {
			return;
		}

		let newVal = insertEstimatedTime(this.props.currentEventID, this.props.value);

		this.props.stateChangeHandler(newVal);
	}




	render() {
		const { classes } = this.props;

		let classlessProps = this.props;
		delete classlessProps[classes];

		if (typeof this.props.value === 'undefined' || this.props.value === null) {
			return null;
		}

		return (
			<React.Fragment>
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
									// console.log("qidForDefaultValue: ", qidForDefaultValue);
									defaultValue = this.props.getQuestionValue(qidForDefaultValue);
									// console.log("Default Value: ", defaultValue);
									if (defaultValue) {
										let QD = this.props.getQuestionData(qidForDefaultValue);
										displayValue = getKeyFromValue(QD.options, defaultValue);
									}
								}

								if (headerKey === SAMPLE_DATE_HEADER) {
									let sdArr = this.props.getQuestionValue("sampleDate").split("-");
									displayValue = sdArr[1] + "/" + sdArr[2] + "/" + sdArr[0];
								}
								if (headerKey === SAMPLE_TIME_HEADER) {
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
												case DESCRIPTION_HEADER:
													Q = this.props.value[rowNum][colNum];
													break;
												case ADD_ON_HEADER:
													Q = <Button key={keyText} onClick={() => this.handleAddOnClickOpen(rowNum, colNum)}>{
														(!this.props.value[rowNum][colNum] || Object.keys(this.props.value[rowNum][colNum]).filter((key) => this.props.value[rowNum][colNum][key]).length === 0)
															? "Add"
															: Object.keys(this.props.value[rowNum][colNum])
																.filter((key) => this.props.value[rowNum][colNum][key])
																.map((key) => allOpts[key])
																.join(",")}
													</Button>

													break;
												case M2LAB_HEADER:
													Q = <Button key={keyText} onClick={() => this.handleM2LClickOpen(rowNum, colNum)}>{
														this.props.value[rowNum][colNum] === ""
															? "Add"
															: "Edit"}
													</Button>;
													break;
												case SAMPLE_TIME_HEADER:
													Q = <Question {...this.classlessProps}
														label=""
														id={keyText}
														key={keyText}
														type="TimeInput"
														alternateChangeHandler={this.handleValueChange(rowNum, colNum)}
														value={this.props.value[rowNum][colNum]}
													/>
													break;
												case SAMPLE_DATE_HEADER:
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





				{this.state.dialogM2LOpen
					?
					<TextFieldDialog
						id="M2L_Dialog"
						open={this.state.dialogM2LOpen}
						onSave={this.handleCellValueSave}
						onClose={this.handleDialogsClose}
						dialogTitle="Message To Lab"
						dialogText="Enter the message you'd like to send to the lab about this particular sample"
						rows={5}
						initialValue={this.state.dialogM2LValue}
					/>
					: null}

				{this.state.dialogAddOnOpen
					// must conditionally render to re-trigger constructor //FUTURE: that can't be the best way to do this  memoization?
					? <MultipleChoiceDialog
						id="AddOnAnalyses"
						open={this.state.dialogAddOnOpen}
						onSave={this.handleCellValueSave}
						onClose={this.handleDialogsClose}
						dialogTitle="Add on Analyses"
						dialogText="Select the available add-on analyses you'd like to have done on this sample"
						noOptionsMessage="There are no available add-on analyses for this sample"
						options={this.state.rowAddOnOptions}
						initialValue={this.state.dialogAddOnValue}
					/>
					: null}



			</React.Fragment>
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

