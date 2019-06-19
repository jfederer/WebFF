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
import { handleNumberOfSamplingPointsChanged } from '../../Utils/GlobalHandlers';
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
				let initValue = {}; //load value with defaults
				this.props.SEQuestionValueChange(this.props.currentEventID, this.props.id, initValue); // save it to the store
			} else {
			console.log("Creating Passed Value Set Information Component");
		}
	}

	setInfoChangeHandler = (eventID, sub_q_id, value) => {
		if(sub_q_id==="numberOfSamplingPoints") {
			handleNumberOfSamplingPointsChanged(eventID, this.props.setName, value);
		}


		let newValue = _.cloneDeep(this.props.value);
		newValue[sub_q_id] = _.cloneDeep(value);
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


