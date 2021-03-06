import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange, numberOfSamplingPointsChanged } from '../../Actions/SamplingEvents'
import _ from 'lodash';


// import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
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
import { SET_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER } from '../../Constants/Config';
import { getGridedQuestions, getQuestionValue, getMethodCategoryFromValue } from '../../Utils/QuestionUtilities';
import { getSetInformationQuestionsData } from '../../Utils/StoreUtilities';
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


export const getRealQID = (setName, sub_q_id) => {
	return SET_INFORMATION_IDENTIFIER + setName + ":" + sub_q_id;
}

class SetInformation extends React.Component {
	constructor(props) {
		super(props);
		//  console.log("SI CONSTRUCTOR PROPS: ", this.props);
		if (_.isEmpty(this.props.value) || typeof this.props.value === "undefined") {
			let initValue = {};
			//load value with default table?
			if (this.props.alternateChangeHandler) {
				this.props.alternateChangeHandler(this.props.currentSamplingEventID, this.props.id, initValue);
			} else {
				this.props.SEQuestionValueChange(this.props.currentSamplingEventID, this.props.id, initValue);
			}
		}

		this.state = {
			showDataTable: Object.keys(this.props.value).includes("samplesTable_" + getMethodCategoryFromValue(this.props.samplingMethod) + "_" + this.props.sedimentType)
		}
	}

	componentDidMount() {
		// This comes up if numberOfSamplingPoints is entered on a set, and then the user goes back and changes the sampling method... this will regenerate the table
		if (this.props.value["numberOfSamplingPoints"]) {
			if (!Object.keys(this.props.value).includes("samplesTable_" + getMethodCategoryFromValue(this.props.samplingMethod) + "_" + this.props.sedimentType)) {
				this.setInfoChangeHandler(this.props.currentSamplingEventID, "numberOfSamplingPoints", this.props.value["numberOfSamplingPoints"]);
			}
		}
	}

	setInfoChangeHandler = (eventID, sub_QID, value) => {
		//   console.log("setInfoChangeHandler(", eventID, sub_QID, value, ")");
		if (sub_QID === "numberOfSamplingPoints") {
			if (parseInt(value) === 0) {
				// can't have a value of zero samples...
				return;
			}
			this.doChange(eventID, sub_QID, value)
			this.setState({ showDataTable: true });
			this.props.numberOfSamplingPointsChanged(eventID, this.props.sedimentType, this.props.setName, this.props.samplingMethod, _.cloneDeep(value), this.setInfoChangeHandler);
			return;
		}

		this.doChange(eventID, sub_QID, value);
	};

	/**
	 * @description doChange exists as separate function so the 'save' and the 'special questions' can be handled more easily. If the 'save' is done in the wrong order, some of the additional changes might not propagate appropriately. DRY
	 */
	doChange = (eventID, sub_QID, value) => {
		// console.log("Set Info: doChange(", eventID, sub_QID, value, ")");

		let splitID = this.props.id.split(IDENTIFIER_SPLITTER);

		let newValue = getQuestionValue(eventID, splitID.shift(), this.props.id); // have to look a the split ID in order to get the VALUE out of questionValues
		newValue[sub_QID] = _.cloneDeep(value);

		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(eventID, this.props.id, newValue);
		} else {
			this.props.SEQuestionValueChange(eventID, this.props.id, newValue);
		}
	};





	render() {
		const { setName, sedimentType, samplingMethod, value } = this.props;
		const questionIDsToGrid = ["startTime", "endTime", "startGageHeight", "endGageHeight", "numberOfSamplingPoints", "numberOfContainers", "samplesComposited", "groupOfSamples"]
		const setInfoQuestionsData = getSetInformationQuestionsData();
		if (sedimentType === null || typeof sedimentType === "undefined")
			return <Typography>Sediment Type not set, please return to field form and set Sediment Type</Typography>

		if (samplingMethod === null || typeof samplingMethod === "undefined")
			return <Typography>Sampling Method not set, please return to field form and set Sampling Method</Typography>

		// console.log("Set Info Render Props: ", this.props);


		let gridedQuestions = [];

		questionIDsToGrid.forEach(sub_QID => { //FUTURE: should we strip whitespace from setName?
			if (!setInfoQuestionsData[sub_QID]) {
				console.warn("Set Information question, " + sub_QID + " attempting to be made that does not exist in setInfoQuestionsData");
				return;
			}
			let realQID = getRealQID(this.props.setName, sub_QID);
			// console.log("DSIQD[" + sub_QID + "]: ", setInfoQuestionsData[sub_QID]);
			gridedQuestions.push(< Question {...setInfoQuestionsData[sub_QID]}
				id={sub_QID}
				key={realQID}
				// value={this.props.value[realQID] ? this.props.value[realQID] : ""}
				value={this.props.value[sub_QID] ? this.props.value[sub_QID] : ""}
				alternateChangeHandler={this.setInfoChangeHandler} />);
		});


		let tableName = "samplesTable_" + getMethodCategoryFromValue(samplingMethod) + "_" + this.props.sedimentType;
		let realTableName = getRealQID(this.props.setName, tableName);

		let analysedForName = "analysedFor_" + sedimentType;
		let realAnalysedForName = getRealQID(this.props.setName, analysedForName);

		return <React.Fragment>
			<div style={{paddingBottom:"10px"}}>
			Set {setName}
			{/* TODO: 'options' button on set information that brings up dialog providing things like "overwrite stationing from X set", "overwrite all data from X set", "rename set", "delete set" } */}

			{getGridedQuestions(gridedQuestions)}


			<Grid container spacing={3}>
				<Grid item xs={12} sm={8}>
					{/* Data table  */}
					{samplingMethod && this.state.showDataTable
						// {samplingMethod && Object.keys(this.props.value).includes("samplesTable_"+getMethodCategoryFromValue(this.props.samplingMethod) + "_" + this.props.sedimentType) 
						? <Question {...setInfoQuestionsData[tableName]}
							id={tableName}
							key={realTableName}
							value={typeof value[tableName] === "undefined"
								? setInfoQuestionsData[tableName].value
								: value[tableName]}
							alternateChangeHandler={this.setInfoChangeHandler} />
						: <Paper><Typography align='center'>Data Table unavailable when sampling method not selected or the number of sampling points has not been filled out</Typography></Paper>
					}
				</Grid>
				<Grid item xs={12} sm={4} style={{alignText:'center'}}>
				{/* analyzedFor multiple choice */}
				{sedimentType  //redundant check
					? <Question {...setInfoQuestionsData[analysedForName]}
						id={analysedForName}
						key={realAnalysedForName}
						value={typeof value[analysedForName] === "undefined"
							? setInfoQuestionsData[analysedForName].value
							: value[analysedForName]}
						alternateChangeHandler={this.setInfoChangeHandler} />
					: <Paper><Typography align='center'>'Analysed For' options unavailable when sediment type not selected</Typography></Paper>
				}
			</Grid>
			</Grid>
			</div>
		</React.Fragment >

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEventQuestionsValues: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsValues,
		defaultQuestionsData: state.Questions.questionsData,
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange,
	numberOfSamplingPointsChanged
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SetInformation));


