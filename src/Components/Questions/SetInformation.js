import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents'
import _ from 'lodash';


// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import Question from '../Question';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Typography from '@material-ui/core/Typography';
// import { allQWDATAOptionalHeaders, allAddOnOpts_bedload, allAddOnOpts_bottom, allAddOnOpts_suspended } from '../../Utils/QuestionOptions';
// import { safeCopy } from '../../Utils/Utilities';
//this.state.value always contains the up-to-date question values/answers.
//values with 'subQuestion' will need to be traced through LS to the sub question value
import { SET_INFORMATION_IDENTIFIER } from '../../Constants/Config';
import { getGridedQuestions, getQuestionValue } from '../../Utils/QuestionUtilities';
import { defaultSetInformationQuestionsData } from '../../Constants/DefaultObjects';
import { Typography, Paper } from '@material-ui/core';

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

export const getRealQID = (setName, sub_q_id) => {
	return SET_INFORMATION_IDENTIFIER + setName + ":" + sub_q_id;
}

class SetInformation extends React.Component {
	constructor(props) {
		super(props);
		// console.log("CONSTRUCTOR PROPS: ", this.props);
		if (_.isEmpty(this.props.value) || typeof this.props.value === "undefined") {
			//load value with defaults
			console.log("Creating Empty Value Set Information Component");
			// console.log("defaultSetInformationQuestionsData: PRE: ", JSON.stringify(defaultSetInformationQuestionsData.samplesTable_EDI.value));
			let initValue = {};
			// Object.keys(defaultSetInformationQuestionsData).map(QID => {
			// 	initValue[QID] = _.cloneDeep(defaultSetInformationQuestionsData[QID].value);
			// })
			// // console.log("defaultSetInformationQuestionsData: POST: ", JSON.stringify(defaultSetInformationQuestionsData.samplesTable_EDI.value));
			// console.log("InitValue:", initValue);
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, initValue);
			// this.setInfoChangeHandler(this.props.currentEventID, this.props.id, initValue);
		} else {
			console.log("Creating Passed Value Set Information Component");
		}
		// let nowValue = [];
		// // let startingPCodes = [];
		// if (this.props.value === null || (this.props.value.length === 1 && this.props.value[0].length === 0)) {// if no value was sent
		// 	console.log("Handed null value, building blank QWDATA Table");

		// 	// build header from scratch
		// 	let headerRow = [];
		// 	Object.keys(allQWDATAOptionalHeaders).forEach((header) => {
		// 		headerRow.push(header);
		// 	});
		// 	nowValue.push(headerRow);

		// 	// build default values (blanks)
		// 	preRequisiteInfo.descriptiveColumn = this.props.getDescriptiveColumnForTable(); // this gives us number of rows too

		// 	//console.log("QWDATA descriptiveColumn: ", preRequisiteInfo.descriptiveColumn);
		// 	for (let i = 1; i < preRequisiteInfo.descriptiveColumn.length; i++) {
		// 		let emptyRow = new Array(headerRow.length - 1).fill("");
		// 		emptyRow.unshift(preRequisiteInfo.descriptiveColumn[i]);
		// 		nowValue.push(emptyRow);
		// 	}

		// 	console.log(nowValue);

		// 	// make the Add-on analysis values arrays
		// 	let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
		// 	if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
		// 	for (let row = 1; row < nowValue.length; row++) { // skip header row
		// 		if (!Array.isArray(nowValue[row][AddOnAnalysesIndex])) {
		// 			nowValue[row][AddOnAnalysesIndex] = [];
		// 		}
		// 	}

		// 	// fill out the estimated time, if possible
		// 	this.insertEstimatedTime(nowValue);

		// }
		// else { // if a value was sent
		// 	// need to ensure the value has the right number of rows
		// 	console.log("Handed existing value: ", this.props.value);

		// 	nowValue = [];
		// 	// build new header row, note, the header row should still be correct.
		// 	nowValue.push(safeCopy(this.props.value[0])); // 

		// 	// build rows based on existing values
		// 	preRequisiteInfo.descriptiveColumn = this.props.getDescriptiveColumnForTable(); // preRequisiteInfo.descriptiveColumn will now be the authoritative new [0] element in each row
		// 	// console.log("NEW FIRST COLUMN: ", preRequisiteInfo.descriptiveColumn);
		// 	for (let newRowNum = 1; newRowNum < preRequisiteInfo.descriptiveColumn.length; newRowNum++) { // start at 1 to skip the header row
		// 		// console.log("Looking for...", preRequisiteInfo.descriptiveColumn[newRowNum]);
		// 		//look in props.value for existing matching row
		// 		let matchingOldRow = -1;
		// 		for (let oldRow = 1; oldRow < this.props.value.length; oldRow++) {
		// 			// console.log("against..." + this.props.value[oldRow][0]);
		// 			if (preRequisiteInfo.descriptiveColumn[newRowNum] === this.props.value[oldRow][0]) {
		// 				// console.log("MATCH!");

		// 				matchingOldRow = oldRow;
		// 				break;
		// 			}
		// 		}

		// 		let newRow = [];
		// 		if (matchingOldRow != -1) {
		// 			newRow = safeCopy(this.props.value[matchingOldRow]);
		// 		} else {
		// 			newRow = new Array(this.props.value[0].length - 1).fill("");
		// 			newRow.unshift(preRequisiteInfo.descriptiveColumn[newRowNum]);
		// 		}

		// 		// ensure add-on analysis is an array
		// 		console.log(newRow);

		// 		let AddOnAnalysesIndex = nowValue[0].indexOf("Add-on Analyses");
		// 		if (AddOnAnalysesIndex < 0) { throw new Error("Add-on Analyses not found in header of QWDATA table") }
		// 		if (!Array.isArray(newRow[AddOnAnalysesIndex])) {
		// 			newRow[AddOnAnalysesIndex] = [];
		// 		}

		// 		nowValue.push(newRow);
		// 	}
	}

	setInfoChangeHandler = (eventID, sub_q_id, value) => {
		console.log(sub_q_id + " incoming value: ", value);
		let newValue = _.cloneDeep(this.props.value);
		newValue[sub_q_id] = value;
		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(this.props.currentEventID, this.props.id, newValue);
		} else {
			this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, newValue);
		}
	};



	render() {
		const { setName, sedimentType, samplingMethod, value } = this.props;
		const questionIDsToGrid = ["startTime", "endTime", "startGageHeight", "endGageHeight", "numberOfSamplingPoints", "numberOfContainers", "samplesComposited", "groupOfSamples"]

		if (sedimentType === null || typeof sedimentType === "undefined")
			return <Typography>Sediment Type not set, please return to field form and set Sediment Type</Typography>

		if (samplingMethod === null || typeof samplingMethod === "undefined")
			return <Typography>Sampling Method not set, please return to field form and set Sampling Method</Typography>

		// console.log("Set Info Render Props: ", this.props);


		let gridedQuestions = [];

		questionIDsToGrid.forEach(sub_QID => { //FUTURE: should we strip whitespace from setName?
			if (!defaultSetInformationQuestionsData[sub_QID]) {
				console.warn("Set Information question, " + sub_QID + " attempting to be made that does not exist in defaultSetInformationQuestionsData");
				return;
			}
			let realQID = getRealQID(this.props.setName, sub_QID);
			// console.log("DSIQD[" + sub_QID + "]: ", defaultSetInformationQuestionsData[sub_QID]);
			gridedQuestions.push(< Question {...defaultSetInformationQuestionsData[sub_QID]}
				id={sub_QID}
				key={realQID}
				// value={this.props.value[realQID] ? this.props.value[realQID] : ""}
				value={this.props.value[sub_QID] ? this.props.value[sub_QID] : ""}
				alternateChangeHandler={this.setInfoChangeHandler} />);
		});


		let tableName = "samplesTable_" + samplingMethod;
		let realTableName = getRealQID(this.props.setName, tableName);

		let analysedForName = "analysedFor_" + sedimentType;
		let realAnalysedForName = getRealQID(this.props.setName, analysedForName);

		return <React.Fragment>
			Set {setName}
			{/* TODO: 'options' button on set information that brings up dialog providing things like "overwrite stationing from X set", "overwrite all data from X set", "rename set", "delete set" } */}

			{getGridedQuestions(gridedQuestions)}



			{/* Data table  */}
			{samplingMethod  //redundant check
				? <Question {...defaultSetInformationQuestionsData[tableName]}
					id={tableName}
					key={realTableName}
					value={typeof value[tableName] === "undefined"
						? defaultSetInformationQuestionsData[tableName].value //Must clone or it modified the default object (this is a problem with )
						: value[tableName]}
					alternateChangeHandler={this.setInfoChangeHandler} />
				: <Paper><Typography align='center'>Data Table unavailable when sampling method not selected</Typography></Paper>
			}


			{/* analyzedFor multiple choice */}
			{sedimentType  //redundant check
				? <Question {...defaultSetInformationQuestionsData[analysedForName]}
					id={analysedForName}
					key={realAnalysedForName}
					value={typeof value[analysedForName] === "undefined"
						? defaultSetInformationQuestionsData[analysedForName].value
						: value[analysedForName]}
					alternateChangeHandler={this.setInfoChangeHandler} />
				: <Paper><Typography align='center'>'Analysed For' options unavailable when sediment type not selected</Typography></Paper>
			}

		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentEventID: state.SedFF.currentSamplingEventID,
		currentEventQuestionsValues: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsValues,
		defaultQuestionsData: state.Questions.questionsData,
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SetInformation));


