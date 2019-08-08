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
import { getDataEntrySheetQuestionsData } from '../../Utils/StoreUtilities';
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

		if (_.isEmpty(this.props.value)) {
			let initValue = {}; //load value with default table?
			if (this.props.alternateChangeHandler) {
				this.props.alternateChangeHandler(this.props.currentSamplingEventID, this.props.id, initValue);
			} else {
				this.props.SEQuestionValueChange(this.props.currentSamplingEventID, this.props.id, initValue);
			}
		} else {
			console.log("Creating Passed Value Data Entry Information Component");
		}
		this.state = {
			// showDataTable: false
		}
	}

	DEChangeHandler = (eventID, sub_QID, value) => {

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

		const dataEntrySheetQuestionsData = getDataEntrySheetQuestionsData();
		console.log('Data Entry Panel props :', this.props);

		const { samplingMethod, sedimentType } = this.props;


		return <React.Fragment>
			<QuestionPage
				questionsData={dataEntrySheetQuestionsData}
				tabName={"Data Entry " + this.props.sedimentType}
				alternateChangeHandler={this.DEChangeHandler} />
			<AddSetForm
				samplingMethod={samplingMethod}
				sedimentType={sedimentType} />
		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		// currentEventQuestionsValues: state.SamplingEvents[state.SedFF.currentSamplingEventID].questionsValues,
		defaultQuestionsData: state.Questions.questionsData,
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntrySheet));


