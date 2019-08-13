import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange, numberOfSamplingPointsChanged } from '../../Actions/SamplingEvents';
import _ from 'lodash';


// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import QuestionPage from '../QuestionPage';
import AddSetForm from '../Pages/DataEntry/AddSetForm';
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
import { DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../Constants/Config';
import { getGridedQuestions, getQuestionValue, getMethodCategoryFromValue } from '../../Utils/QuestionUtilities';
import { getDataEntrySheetQuestionsData, getQuestionsData } from '../../Utils/StoreUtilities';
import { addQuestionToEvent } from '../../Actions/Questions';
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


export const getRealQID = (sedimentType, sub_q_id) => {
	return DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + ":" + sub_q_id;
}

class DataEntrySheet extends React.Component {
	constructor(props) {
		super(props);
		console.log("DES: CONSTRUCTOR: currentEvent.questionsValues.DataEntry::Suspended:  ", JSON.stringify(this.props.currentEvent.questionsValues["DataEntry::Suspended"]));
		console.log("DES: CONSTRUCTOR: this.props.value: ", this.props.value);
		if (_.isEmpty(this.props.value)) {
			let initValue = {}; //load value with default?
			if (this.props.alternateChangeHandler) {
				console.log("DES init alt");
				this.props.alternateChangeHandler(this.props.currentSamplingEventID, this.props.id, initValue);
			} else {
				console.log("DES init stand");
				this.props.SEQuestionValueChange(this.props.currentSamplingEventID, this.props.id, initValue);
			}
		} else {
			console.log("Creating Passed Value Data Entry Information Component");
		}

		//check if custom question has been added, if not, add custom Data Entry question// TODO: ?

		// if (!getQuestionDataFromID(DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType)) {
		// 	let thisDataEntryCustomQuestion = getDataEntrySheetQuestionsData(this.props.sedimentType);
		// 	thisDataEntryCustomQuestion.id = DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType;
		// 	this.props.addQuestionToEvent(this.props.currentSamplingEventID, thisDataEntryCustomQuestion);
		// }

		this.state = {
			show: false
		}
	}

	DEChangeHandler = (eventID, sub_QID, value) => {
		console.log("DEChangeHandler(", eventID, ", ", sub_QID, ", ", value, ")");
		this.setState({ show: !this.state.show });  // triggers new render of component
		this.doChange(eventID, sub_QID, value);
	};

	/**
	 * @description doChange exists as separate function so the 'save' and the 'special questions' can be handled more easily. If the 'save' is done in the wrong order, some of the additional changes might not propagate appropriately. DRY
	 */
	doChange = (eventID, sub_QID, value) => {
		let newValue = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType);
		newValue[sub_QID] = _.cloneDeep(value);

		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(eventID, this.props.id, newValue);
		} else {
			this.props.SEQuestionValueChange(eventID, this.props.id, newValue);
		}
	};


	render() {

		let QD = getQuestionsData(this.props.currentSamplingEventID);

		// let dataEntrySheetQuestionsData = Object.keys(QD).filter(key => {
		// 	console.log("key: ", key);
		// 	return key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType)
		// 	}
		// );

		const dataEntrySheetQuestionsData = Object.keys(QD)
		.filter(key =>  key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType))
		.reduce((obj, key) => {
		  obj[key] = QD[key];
		  return obj;
		}, {});
	  

		// const dataEntrySheetQuestionsData = getQuestionDataFromID(DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType);

		//Add in applicable custom questions (generally set information questions)
		// getQuestionsData()

		console.log('DES: dataEntrySheetQuestionsData :', dataEntrySheetQuestionsData);
		console.log("DES: currentEvent.questionsValues.DataEntry::Suspended:  ", JSON.stringify(this.props.currentEvent.questionsValues["DataEntry::Suspended"]));



		const { samplingMethod, sedimentType } = this.props;

		return <React.Fragment>
			<QuestionPage
				questionsData={dataEntrySheetQuestionsData}
				parentComponentNames={[DATA_ENTRY_INFORMATION_IDENTIFIER + this.props.sedimentType]}
				tabName={"DataEntry"}
				alternateChangeHandler={this.DEChangeHandler} />
			<AddSetForm
				samplingMethod={samplingMethod}
				sedimentType={sedimentType}
				alternateChangeHandler={this.DEChangeHandler} />
		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		// currentEventQuestionsValues: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsValues,
		defaultQuestionsData: state.Questions.questionsData,
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange,
	addQuestionToEvent
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntrySheet));


