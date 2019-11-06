import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { SEQuestionValueChange, SEQuestionValueDelete } from '../../Actions/SamplingEvents';
import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import _ from 'lodash';


// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import { createQuestionComponents } from '../../Utils/QuestionUtilities';
import QuestionPanel from '../QuestionPanel';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// import { allQWDATAOptionalHeaders, allAddOnOpts_bedload, allAddOnOpts_bottom, allAddOnOpts_suspended } from '../../Utils/QuestionOptions';
// import { safeCopy } from '../../Utils/Utilities';
//this.state.value always contains the up-to-date question values/answers.
//values with 'subQuestion' will need to be traced through LS to the sub question value
import { DATA_ENTRY_INFORMATION_IDENTIFIER, WATERWAY_INFORMATION_IDENTIFIER, IET_REQUIRING_SAMPLER_TYPE_VALUES } from '../../Constants/Config';
import { defaultWaterwayInfoQuestionsData } from '../../Constants/DefaultObjects';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import { getQuestionsData } from '../../Utils/StoreUtilities';
import { addQuestionToEvent } from '../../Actions/Questions';
import { showQuestionPanel, hideQuestionPanel } from '../../Actions/UI';
import { getGridedQuestions } from '../../Utils/QuestionUtilities';
import { Button } from '@material-ui/core';

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

const defaultPierQuestion = {
	"id": "pier_X_start",
	"label": "PIER START",
	"type": "Text",
	"placeholder": "Feet from XYZ",
	"value": "",
	"tabName": "FieldForm",
	"layoutGroup": "Waterway Info",
	"width_xs": 5,
	"width_lg": 2
}

const defaultPierObject = {
	"start": "",
	"end": "",
	"number": ""
}



class WaterwayInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			basicQuestions: Object.keys(defaultWaterwayInfoQuestionsData).map(key => defaultWaterwayInfoQuestionsData[key]),
			// pierQuestions: [],
			... this.props.value
		}


		// const { id, currentSamplingEventID, value } = this.props;

		// if (DEBUG) console.log("DES: CONSTRUCTOR: this.props.value: ", this.props.value);
		// if (_.isEmpty(value)) {
		// 	let initValue = {}; //load value with default?
		// 	if (this.props.alternateChangeHandler) {
		// 		if (DEBUG) console.log("DES init alt");
		// 		this.props.alternateChangeHandler(currentSamplingEventID, id, initValue);
		// 	} else {
		// 		if (DEBUG) console.log("DES init stand");
		// 		this.props.SEQuestionValueChange(currentSamplingEventID, id, initValue);
		// 	}
		// } else {
		// 	if (DEBUG) console.log("Creating Passed Value Data Entry Information Component");
		// }

		// this.state = {
		// 	show: false
		// }
	}

	WWIChangeHandler = (eventID, QID, value) => {
		if(QID.startsWith("pier_")) {
			//create updated piers objects
			let pierNumber = QID.split("_")[1];
			let startEnd = QID.split("_")[2]
			let newPiers = _.cloneDeep(this.state.piers);
			newPiers[pierNumber-1][startEnd]=value;
			this.setState({piers:newPiers}, () => this.doChange(eventID))
		} else {
			this.setState({ [QID]: value }, () => this.doChange(eventID));
		}
	};

	doChange = (eventID) => {
		let newWWValue = _.cloneDeep(this.state);
		delete newWWValue.basicQuestions;
		this.props.SEQuestionValueChange(eventID, this.props.id, newWWValue);
	}

	addPierClickedHandler = () => {

		if (!this.state.piers) {
			console.warn("state does not contain piers property in waterway info")
			return;
		}

		let newPiers = _.cloneDeep(this.state.piers);
		let newPier = _.cloneDeep(defaultPierObject);
		newPier.number = this.state.piers.length + 1;
		newPiers.push(newPier);
		this.setState({piers:newPiers});



		// let newPierStartQuestion = {
		// 	..._.cloneDeep(pierQuestion),
		// 	id: "pier_" + pierNumber + "_start",
		// 	key: "pier_" + pierNumber + "_start",
		// 	label: "Pier #" + pierNumber + " Start",
		// };
		// let newPierEndQuestion = {
		// 	..._.cloneDeep(pierQuestion),
		// 	id: "pier_" + pierNumber + "_end",
		// 	key: "pier_" + pierNumber + "_end",
		// 	label: "Pier #" + pierNumber + " End",
		// };

		//OPTION 1 -- add them, effectively, as custom questions.... lack of customization
		// this.props.addQuestionToEvent(this.props.currentSamplingEventID, newPierStartQuestion);
		// this.props.addQuestionToEvent(this.props.currentSamplingEventID, newPierEndQuestion);

		//OPTION 2 -- make Waterway info a more complex, and customizable... end up with orphaned "questionValues" that don't have "questionData"
		// let newQuestions = _.cloneDeep(this.state.pierQuestions);
		// newQuestions.push(newPierStartQuestion);
		// newQuestions.push(newPierEndQuestion);
		// this.setState({ pierQuestions: newQuestions });

	}

	removePierClickedHandler = (pierNumberToRemove) => {
		let newPiers = _.cloneDeep(this.state.piers).filter(pier => pier.number !== pierNumberToRemove);

		this.setState({ piers: newPiers }, ()=>this.doChange(this.props.currentSamplingEventID));
	}

	render() {
		const { currentEvent, sedimentType, currentSamplingEventID } = this.props;
		// console.log('this.props :', this.props);
		// console.log('this.state :', this.state);
		if (!this.state.piers) {
			console.warn("Waterway Info State does not contain 'piers' property")
			return;
		}


		// let QD = getQuestionsData(currentSamplingEventID);

		// const dataEntrySheetQuestionsData = Object.keys(QD)
		// 	.filter(key => key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType))
		// 	.reduce((obj, key) => {
		// 		obj[key] = QD[key];
		// 		return obj;
		// 	}, {});

		// if (DEBUG) console.log('DES: PRE: dataEntrySheetQuestionsData :', _.cloneDeep(dataEntrySheetQuestionsData));

		// //rip open the DES questionsData object so we match expected input for QuestionPage
		// Object.keys(dataEntrySheetQuestionsData[DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType]).forEach(sub_QID => {
		// 	dataEntrySheetQuestionsData[sub_QID] = dataEntrySheetQuestionsData[DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType][sub_QID];
		// });

		// if (DEBUG) console.log('DES: POST: dataEntrySheetQuestionsData :', dataEntrySheetQuestionsData);

		// // //TODO:  Kludge until we get "order priority" into questions data.   By default, Object.keys returns in the order the items were added ... so this keeps 'sets' at the bottom of the questoinPage.

		// Object.entries(dataEntrySheetQuestionsData).forEach(([key, value]) => {
		// 	if (key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER)) {
		// 		let tempVal = value;
		// 		delete dataEntrySheetQuestionsData[key];
		// 		dataEntrySheetQuestionsData[key] = tempVal;
		// 	}
		// });



		// console.log("Set VALUE", getQuestionValue(this.props.currentSamplingEventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType, DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER + 'A'));

		// let questions = Object.keys(defaultWaterwayInfoQuestionsData).map(key=><Question></Question>)
		let pierQuestions = [];
		
		this.state.piers.forEach(pierData => {
			let pierStartQuestion = _.cloneDeep(defaultPierQuestion);
			pierStartQuestion.id = "pier_" +pierData.number+ "_start";
			pierStartQuestion.label = "Pier " +pierData.number+ " start";
			pierStartQuestion.value = pierData.start ? pierData.start : "";
			pierQuestions.push(pierStartQuestion);

			let pierEndQuestion = _.cloneDeep(defaultPierQuestion);
			pierEndQuestion.id = "pier_" +pierData.number+ "_end";
			pierEndQuestion.label = "Pier " +pierData.number+ " end";
			pierEndQuestion.value = pierData.end ? pierData.end : "";
			pierQuestions.push(pierEndQuestion);
			})
		


		return <React.Fragment>
			{/* OPTION #1... doesn't involve any question creation here... */}

			{/* OPTION #2... */}
			{getGridedQuestions(createQuestionComponents(this.state.basicQuestions,
				this.state,
				this.WWIChangeHandler))}

{/* TODO: build pier question type and have better/combined look */}


					{/* let pierEndQuestion = _.cloneDeep(defaultPierQuestion) = {
						"id": "PierEnd"+pierData.number,
						"label": "Pier " +pierData.number+ " end",
						"type": "Text",
						"placeholder": "Feet from XYZ",  //TODO:
						"value": pierData.end ? pierData.end : "",
						"width_xs": 5,
						"width_lg": 2
					}
					return pierStartQuestion;
				})} */}

			{createQuestionComponents(pierQuestions, {}, this.WWIChangeHandler)}


			<Button onClick={this.addPierClickedHandler}>ADD PIER</Button>
			{this.state.piers.length
				? <Button onClick={() => this.removePierClickedHandler(this.state.piers.length)}>Remove pier</Button>
				: null}
		</React.Fragment>

	}
}


const mapStateToProps = function (state) {
	return {
		currentSamplingEventID: state.SedFF.currentSamplingEventID,
		// currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],

	}
}

const mapDispatchToProps = {
	SEQuestionValueChange,
	SEQuestionValueDelete,
	addQuestionToEvent
}

WaterwayInfo.propTypes = {

};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(WaterwayInfo));


