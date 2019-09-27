import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
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
import { DATA_ENTRY_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER, SET_INFORMATION_IDENTIFIER, IET_REQUIRING_SAMPLER_TYPE_VALUES } from '../../Constants/Config';
import { getGridedQuestions, getQuestionValue, getMethodCategoryFromValue } from '../../Utils/QuestionUtilities';
import { getDataEntrySheetQuestionsData, getQuestionsData } from '../../Utils/StoreUtilities';
import { addQuestionToEvent } from '../../Actions/Questions';
import { showQuestionPanel, hideQuestionPanel } from '../../Actions/UI';
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

const DEBUG = false;

class DataEntrySheet extends React.Component {
	constructor(props) {
		super(props);
		const { id, sedimentType, currentSamplingEventID, value } = this.props;

		if (DEBUG) console.log("DES: CONSTRUCTOR: this.props.value: ", this.props.value);
		if (_.isEmpty(value)) {
			let initValue = {}; //load value with default?
			if (this.props.alternateChangeHandler) {
				if (DEBUG) console.log("DES init alt");
				this.props.alternateChangeHandler(currentSamplingEventID, id, initValue);
			} else {
				if (DEBUG) console.log("DES init stand");
				this.props.SEQuestionValueChange(currentSamplingEventID, id, initValue);
			}
		} else {
			if (DEBUG) console.log("Creating Passed Value Data Entry Information Component");
		}

		this.state = {
			show: false
		}
	}

	DEChangeHandler = (eventID, sub_QID, value) => {
		if (DEBUG) console.log("DES: DEChangeHandler(", eventID, ", ", sub_QID, ", ", value, ")");

		if (sub_QID.startsWith("samplerType_")) {
			//depending on what sampler type was selected, we need to show the IET
			if (IET_REQUIRING_SAMPLER_TYPE_VALUES.includes(value)) {
				this.props.showQuestionPanel("DataEntry:IntakeEfficiencyTest&&DataEntry::" + this.props.sedimentType);
			} else {
				this.props.hideQuestionPanel("DataEntry:IntakeEfficiencyTest&&DataEntry::" + this.props.sedimentType);
			}

			// if(BOTTLE_USING_SAMPLER_TYPE_VALUES.includes(value)) {
			// 	this.props.showQuestion()
			// }


		}




		this.setState({ show: !this.state.show });  // triggers new render of component  //FIXME: not sure why this is needed

		this.doChange(eventID, sub_QID, value);
	};

	/**
	 * @description doChange exists as separate function so the 'save' and the 'special questions' can be handled more easily. If the 'save' is done in the wrong order, some of the additional changes might not propagate appropriately. DRY
	 */
	doChange = (eventID, sub_QID, value) => {
		const { id, sedimentType } = this.props;

		let newValue = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType);
		newValue[sub_QID] = _.cloneDeep(value);

		if (this.props.alternateChangeHandler) {
			this.props.alternateChangeHandler(eventID, id, newValue);
		} else {
			this.props.SEQuestionValueChange(eventID, id, newValue);
		}
	};


	render() {
		const { samplingMethod, sedimentType, currentSamplingEventID } = this.props;

		if (DEBUG) console.log('DES: Render: this.props :', this.props);

		let QD = getQuestionsData(currentSamplingEventID);

		if (DEBUG) console.log('DES: all QD :', QD);

		const dataEntrySheetQuestionsData = Object.keys(QD)
			.filter(key => key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType))
			.reduce((obj, key) => {
				obj[key] = QD[key];
				return obj;
			}, {});

		if (DEBUG) console.log('DES: PRE: dataEntrySheetQuestionsData :', _.cloneDeep(dataEntrySheetQuestionsData));

		//rip open the DES questionsData object so we match expected input for QuestionPage
		Object.keys(dataEntrySheetQuestionsData[DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType]).forEach(sub_QID => {
			dataEntrySheetQuestionsData[sub_QID] = dataEntrySheetQuestionsData[DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType][sub_QID];
		});

		if (DEBUG) console.log('DES: POST: dataEntrySheetQuestionsData :', dataEntrySheetQuestionsData);

		// //TODO:  Kludge until we get "order priority" into questions data.   By default, Object.keys returns in the order the items were added ... so this keeps 'sets' at the bottom of the questoinPage.

		Object.entries(dataEntrySheetQuestionsData).forEach(([key, value]) => {
			if (key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER)) {
				let tempVal = value;
				delete dataEntrySheetQuestionsData[key];
				dataEntrySheetQuestionsData[key] = tempVal;
			}
		});

		// console.log("Set VALUE", getQuestionValue(this.props.currentSamplingEventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType, DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER + 'A'));

		return <React.Fragment>
			<QuestionPage
				questionsData={dataEntrySheetQuestionsData}
				parentComponentNames={[DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType]}
				tabName={"DataEntry"}
				alternateChangeHandler={this.DEChangeHandler}
				samplingMethod={samplingMethod}
				sedimentType={sedimentType}
			/>
			<AddSetForm
				samplingMethod={samplingMethod}
				sedimentType={sedimentType}
				alternateChangeHandler={this.DEChangeHandler}
			/>
		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
		
	}
}

const mapDispatchToProps = {
	SEQuestionValueChange,
	addQuestionToEvent,
	showQuestionPanel,
	hideQuestionPanel
}

DataEntrySheet.propTypes = {
	sedimentType: PropTypes.string.isRequired,
	samplingMethod: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntrySheet));


