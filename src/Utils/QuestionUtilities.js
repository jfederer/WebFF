import React from 'react'; //lets me use JSX
import Question from '../Components/Question';
import { Grid } from '@material-ui/core';
import _ from 'lodash';
import { getEventFromID, getQuestionsData } from './StoreUtilities';


export const createQuestionComponents = (questionsData, questionsValues, alternateChangeHandler, debug) => {
	// creates one question component for every question in questionsData
	// if value exists in currentSamplingEvent, this value takes precidence over value from questionsData
	// returns array of question components

	let questionComponents = [];
	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
		questionComponents = questionsData.map(questionData => {
			let value = questionData.value;
			if (debug) console.log("CREATEQ: First Assigned: ", value);
			if (debug) console.log("CREATEQ: questionsVallues: ", questionsValues);
			if (debug) console.log("CREATEQ: questionData.id: ", questionData.id);
			if (debug) console.log("CREATEQ: questionsValues[questionData.id]: ", questionsValues[questionData.id]);
			if (questionsValues[questionData.id] !== null && typeof questionsValues[questionData.id] !== 'undefined') {
				// question exists in questionsValues.  Note, keep not-equal-to-null, as the questionValue can be a boolean and break stuff
				value = questionsValues[questionData.id];
				if (debug) console.log("CREATEQ: OVERWRITE WITH: ", value);
			}

			let retQ = <Question {...questionData}
				value={value}
				key={questionData.id["key"] ? questionData.id["key"] : questionData.id}
				alternateChangeHandler={alternateChangeHandler} />;
			if (debug) console.log("CREATEQ: VALUE AT RETURN: ", value);
			return retQ;
		});
	}

	return questionComponents;
}

function lookDeeper(QIDvalue, QIDtype, sub_QIDs) {

	console.log("lookDeeper(", QIDvalue, ",", QIDtype, ",", sub_QIDs, ")");

	// let sub_QID = sub_QIDs[i++];
	// console.log("go deeper");
	// console.log("QIDvalue: ", QIDvalue, "  sub_QID:", sub_QID, "= ", QIDvalue[sub_QID]);
	// if (typeof QIDvalue[sub_QID] === 'undefined') {
	// 	console.warn("Returning undefined from question ID '" + questionID + "' with sub_QID of :", sub_QID);
	// 	return undefined;
	// }
	// if (QIDvalue[sub_QID] === null) {
	// 	console.log("QIDvalue: ", QIDvalue, "  sub_QID:", sub_QID, "... equals null");
	// 	return null;
	// }
	// QIDvalue = ];

	if (QIDvalue === null) {
		return null;
	}

	if (typeof QIDvalue === 'undefined') {
		return undefined;
	}

	if (sub_QIDs.length < 1) {
		if (QIDtype === "QuestionsData") {
			console.log("Returning QD: ", QIDvalue.value);
			return QIDvalue.value;
		} else {
			console.log("Returning QV: ", QIDvalue);
			return QIDvalue;
		}
	}

	return lookDeeper(QIDvalue[sub_QIDs.shift()], QIDtype, sub_QIDs);

}

export const getQuestionValue = (eventID, questionID, ...sub_QIDs) => { //****  //TODO: error reasonably when  curSamplingEvent is undefined
	//TODO: rewrite comments, rename lookdeeper, cleanup...

	// eventID: string eventID to look for the value in.
	// questionID: string question ID associated with a question
	// returns VALUE associated with the q_id... first searching dialogQuestions, then searching the currentSamplingEvent, then, finally, questionsData.  //TODO: still true?
	// note, given currentSamplingEvent is built from questionsData, the instances where a value would be in questionsData and NOT in current sampling event are very exotic
	// throws error if no question is found

	console.log("Get value(" + eventID + ", " + questionID + ", " + sub_QIDs + ")");

	let event = getEventFromID(eventID);
	let questionsData = getQuestionsData();

	// console.log("GQV: EVENT: ", event);
	// console.log("GQV: QD: ", questionsData);
	// console.log("GQV: QD[QI]: ", questionsData[questionID]);

	let Qvalue = lookDeeper(questionsData[questionID].value, "QuestionsData", _.cloneDeep(sub_QIDs));
	console.log("REsulting QIDvale: ", Qvalue);

	let Evalue = lookDeeper(event.questionsValues, "QuestionsValues", [questionID, ..._.cloneDeep(sub_QIDs)]);
	console.log("REsulting Evalue: ", Evalue);

	let retVal;
	if(typeof Qvalue === 'undefined') {
		retVal = Evalue;
	}

	if(typeof Evalue === 'undefined') {
		retVal = Qvalue;
	}

	if(Evalue === null && Qvalue !== null) {
		retVal = Qvalue;
	}

	retVal = Evalue;

	// QIDvalue = lookDeeper(questionsData[questionID].value, "QuestionsData", sub_QIDs);

	//defined?
	// if (typeof event.questionsValues[questionID] === 'undefined') {
	// 	// not defined in event, check questionsData
	// 	if (typeof questionsData[questionID].value === 'undefined') {
	// 		// if questionsDat also doesn't have it... too bad for us.
	// 		console.warn("returning undefined value from question " + questionID);
	// 		return undefined;
	// 	} else {
	// 		QIDvalue = lookDeeper(questionsData[questionID].value, "QuestionsData", sub_QIDs);
	// 	}
	// } else {
	// 	QIDvalue = lookDeeper(event.questionsValues[questionID], "QuestionsValues", sub_QIDs);
	// }










	// }

	// //if simple question
	// if(typeof value !== 'object') {
	return _.cloneDeep(retVal);
	// } else {
	// 	return "VALUE IS OBJECT";
	// }
	// console.log("Event: ", event);

	// console.log("Value: ", value);

	// if table question

	// if complex question


	//note: searched first because if we search for a dialog question before loading a current sampling event, it would throw an error
	// for (let i = 0; this.state.dialogQuestions && i < this.state.dialogQuestions.length; i++) {
	// 	for (let k = 0; this.state.dialogQuestions[i] && k < this.state.dialogQuestions[i].questions.length; k++) {
	// 		if (this.state.dialogQuestions[i].questions[k].id === q_id) {
	// 			let ret = this.state.dialogQuestions[i].questions[k].value;
	// 			if (Array.isArray(ret)) {
	// 				return ret.slice();
	// 			}
	// 			return ret;
	// 		}
	// 	}
	// }

	// let curSE = this.isCurrentSamplingEventReady("getQuestionValue(" + q_id + ")");

	// if (questionID in curSE.questionsValues) {
	// 	let ret = curSE.questionsValues[q_id];
	// 	if (Array.isArray(ret)) {
	// 		return ret.slice();
	// 	}
	// 	return ret;
	// }

	// for (let i = 0; i < this.state.questionsData.length; i++) {
	// 	if (this.state.questionsData[i].id === q_id) {
	// 		let ret = this.state.questionsData[i].value;
	// 		if (Array.isArray(ret)) {
	// 			return ret.slice();
	// 		}
	// 		return ret;
	// 	}
	// }

	// throw new Error("Question not found in current sampling event, dialog questions, or default config questions.  WebFF.getQuestionValue(" + q_id + ")");


}




export const getQuestionDataFromQuestionsDataByQuestionID = (questionsData, questionID) => {
	let DEBUG = false;

	if (DEBUG) console.log("--------------");
	if (DEBUG) console.log(questionsData);
	if (DEBUG) console.log("looking for questionID: ", questionID);

	let questionData = questionsData.filter(questionData => {

		// var areEqual = questionData.id.toUpperCase() === questionID.toUpperCase();
		// console.log(questionData.id + " " + areEqual);

		if (questionData.id === questionID) {
			if (DEBUG) console.log("Found");
			return questionData;
		}
		return null;
	}
	);

	if (DEBUG) console.log(questionData);

	if (questionData != null && questionData.length === 1) {

		return questionData[0];
	} else {
		return null; //TODO: throw errors
	}
}

export const getTabQuestionsData = (questionsData, tabName) => {
	//given OBJECT questionsData and STRING tabName... 
	//... will return all questionsData objects where question.tabName matches tabName
	let tabQuestionsData = [];
	Object.keys(questionsData).forEach(key => {
		if (questionsData[key].tabName.replace(/ /g, '') === tabName.replace(/ /g, '')) {
			tabQuestionsData.push(questionsData[key]);
		}
	});
	return tabQuestionsData;
}

export const getLayoutGroupNames = (questionsData) => {
	// provided with ARRAY questionData, will return array of layout group names (strings)
	let layoutGroupNames = [];

	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
		for (let i = 0; i < questionsData.length; i++) {
			if (!layoutGroupNames.includes(questionsData[i].layoutGroup)) {
				layoutGroupNames.push(questionsData[i].layoutGroup);
			}
		}
	}
	return layoutGroupNames;
}

export const getLayoutGroupQuestionsData = (questionsData, layoutGroupName) => {
	// given ARRAY questionData, will filter down to items that match questionData.layoutgroup = layoutGroupName ....
	let layoutGroupQuestionsData = [];

	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
		layoutGroupQuestionsData = questionsData.filter((questionData) => {
			return questionData.layoutGroup === layoutGroupName;
		});
	}
	return layoutGroupQuestionsData;

}



export const saveQuestionValueToLS = (Q) => {
	//this function saves updated question "values" (must be located at "Q.state.value") to localStorage.questionsData
	// returns updated questionsData object
	//console.log("getQuestionDataWithUpdatedValue", Q.state.value);
	var DEBUG = false;
	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q: ", Q);
	if (Q == null) { //POC
		console.log("Question passed to getQuestionDataWithUpdatedValue was null or undefined");
		return;
	}

	// get the questions in localStorage
	var questionsDataFromLS = JSON.parse(localStorage.getItem('questionsData'));
	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionsDataFromLS: ", questionsDataFromLS);

	// find the specific question in questionsDataFromLS based on the id,then update the value property
	var newQuestionsData = questionsDataFromLS.filter(questionData => {
		//if (DEBUG) console.log("saveQuestionValueToLS: ", questionData.id + " === " + Q.props.id);
		if (questionData.id === Q.props.id) {
			if (DEBUG) console.log("------FOUND!--------");
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (pre): ", questionData);
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q.state.value", Q.state.value);
			questionData.value = Q.state.value;
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (post)", questionData);

		} else {
			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: no");
		}
		return questionData;
	});

	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: newQuestionsData: ", newQuestionsData);

	// replace the questionData in localStorage
	localStorage.setItem('questionsData', JSON.stringify(newQuestionsData));

}

export const getGridedQuestions = (questions) => {
	return <Grid
		container
		spacing={10}
		alignItems='baseline'
		alignContent='center'
		// justify='space-around' 
		justify="center"
	>
		{questions.map((question) => { // place all questions in grids of appropriate size
			if (!question.props.hidden)
				if ((question.props.width_xs === '' || question.props.width_xs == null) && (question.props.width_lg === '' || question.props.width_lg == null)) {
					// neither lg or xs are set.
					return <Grid item
						key={question.props.id + '_grid'} xs lg>
						{question}
					</Grid>

				} else if (question.props.width_xs === '' || question.props.width_xs == null) {
					// xs is not set
					return <Grid item
						key={question.props.id + '_grid'} xs lg={question.props.width_lg}>
						{question}
					</Grid>

				} else if (question.props.width_lg === '' || question.props.width_lg == null) {
					// lg is not set
					return <Grid item
						key={question.props.id + '_grid'} xs={question.props.width_xs} lg>
						{question}
					</Grid>

				} else {
					// both lg and xs are set.
					return <Grid item
						key={question.props.id + '_grid'} xs={question.props.width_xs} lg={question.props.width_lg}
					>
						{question}
					</Grid>
				}
			//TOOD throw error, shouldn't get here.
			return null;
		})}
	</Grid>
}

