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


class QWDATATable extends React.Component {
	constructor(props) {
		super(props);
		console.log("QWDATA TABLE CONSTRUCTOR");

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
		let newValue = this.props.value.slice();

		// note, much of this will break upon resizing or adding columns

		//build correct header  
		for (let i = 0; i < newValue[0].length; i++) {
			newValue[0][i] = Object.keys(this.state.headers)[i];
		}

		// check that the Add-on analysis values are arrays
		let AddOnAnalysesIndex = newValue[0].indexOf("Add-on Analyses");
		if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }

		for (let row = 1; row < newValue.length; row++) {
			if (!Array.isArray(newValue[row][AddOnAnalysesIndex])) {
				newValue[row][AddOnAnalysesIndex] = [];
			}
		}

		//set the first column values to something correct
		let desriptiveColumn = this.props.getDescriptiveColumnForTable();
		let SetSampDistIndex = newValue[0].indexOf("Set-Sample @ Dist");
		if (SetSampDistIndex < 0) { throw new Error("'Set-Sample @ Dist' not found in header of QWDATA table") }
		for (let row = 1; row < newValue.length; row++) {
			if (!Array.isArray(newValue[row][SetSampDistIndex])) {
				//				needsArraysAdded = true;
				newValue[row][SetSampDistIndex] = desriptiveColumn[row];
			}
		}

		// //set the sample dates from the field form entry
		// let defaultDate = this.props.getQuestionValue("sampleDate");
		// let sampleDateIndex = newValue[0].indexOf("Sample Date");
		// for (let row = 1; row < newValue.length; row++) {
		// 	newValue[row][sampleDateIndex] = defaultDate;
		// }

		this.setState({ value: newValue });
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
				return null;
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

	getKeyFromValue(obj, value) {

		let retKey = null;
		Object.keys(obj).forEach((key) => {
			if (obj[key] === value) {
				retKey = key;
			}
		});
		return retKey;
	}

	render() {
		if (!this.props.globalState.curSamplingEventName) {
			return <React.Fragment></React.Fragment>;  //no event name event loaded, just return
		}

		const { classes } = this.props;
		// console.log("QWDATA Render props: ", this.props);

		// console.log("QWDATA Render state: ", this.state);
		let classlessProps = this.props;
		delete classlessProps[classes];

		// let evtName = this.props.globalState.curSamplingEventName;


		return (
			<React.Fragment>
				<br></br>
				<Typography style={{ flex: 1 }}>Ensure unique sample times.   All samples will get codes in parenthesis (values pulled from FieldForm page), unless changed here.</Typography>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							{Object.keys(this.state.headers).map((headerKey) => {
								let headerValue = this.state.headers[headerKey];
								// console.log(headerKey +"="+headerValue);

								let defaultValue = null;
								let displayValue = null;
								if (headerValue) {
									let qidForDefaultValue = this.state.headers[headerKey];
									// console.log("qidForDefaultValue: ", qidForDefaultValue);
									defaultValue = this.props.getQuestionValue(qidForDefaultValue);
									// console.log("Default Value: ", defaultValue);
									if (defaultValue) {
										let Q = this.props.getQuestionData(qidForDefaultValue);
										displayValue = this.getKeyFromValue(Q.options, defaultValue);
									}
								}

								if (headerKey === "Sample Date") {
									let sdArr = this.props.getQuestionValue("sampleDate").split("-");
									displayValue = sdArr[1]+"/"+sdArr[2]+"/"+sdArr[0];
									console.log(displayValue);
								}

								return (
									<TableCell className={classes.tableCell} key={"QWDATA_" + headerKey} >
										{headerKey}
										{displayValue ? <br /> : null}
										{displayValue
											? "(" + displayValue + ")"
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
														value={this.state.value[rowNum][colNum]}
													/>
													break;
												case "Sample Date":
													Q = <Question {...this.classlessProps}
														label=""
														id={keyText}
														key={keyText}
														type="DateInput"
														stateChangeHandler={this.handleValueChange(rowNum, colNum)}
														value={this.state.value[rowNum][colNum]}
													/>
													break;
												default: throw new Error(headerKey + " case not handled in QWDATA table");
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