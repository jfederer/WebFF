import React from 'react'; //lets me use JSX
import Question from '../Components/Question';
import { Grid } from '@material-ui/core';
import _ from 'lodash';
import { getEventFromID, getQuestionsData, getSetListAsArray, getNumberOfSamplesInSet, getSetInformationQuestionsData } from './StoreUtilities';
import {
	SET_INFORMATION_IDENTIFIER, QUESTIONS_DATA_OBJECT_TYPE, QUESTIONS_VALUES_OBJECT_TYPE,
	EDI_METHOD_CATEGORY, EWI_METHOD_CATEGORY, OTHER_METHOD_CATEGORY
} from '../Constants/Config';
import { DESCRIPTION_HEADER } from '../Constants/Dictionary';

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

/**
 * 
 * @desc Finds value in given object.  Object structure is defined by the haystackType.  Recursively digs into haystack until sub_QIDs are exhausted.
 * @param {Object} haystack object to look for the given sub_QIDs in.
 * @param {Enum} haystackType format of haystack. Specifically, if the haystack is questionsData [QUESTIONS_DATA_OBJECT_TYPE] (which requires looking at .value) or already a set of questionsValues [QUESTIONS_VALUES_OBJECT_TYPE]. 
 * @param {Array} sub_QIDs questionID's as strings for child objects, in genelogical order from parent to child.  
 * @warn sub_QIDs is directly mutated as part of keeping the recursion performant.
 * @returns returns value associated with the questionID/sub_QIDs...  This may come back as undefined, null, or empty objects as appropriate.  Calling function must handle any return errors.
 */
function recursiveGetValue(haystack, haystackType, sub_QIDs) {
	if (haystack === null) {
		return null;
	}

	if (typeof haystack === 'undefined') {
		return undefined;
	}

	if (sub_QIDs.length < 1) {
		if (haystackType === QUESTIONS_DATA_OBJECT_TYPE) {
			return haystack.value;
		} else {
			return haystack;
		}
	}

	return recursiveGetValue(haystack[sub_QIDs.shift()], haystackType, sub_QIDs);
}


/**
 * @desc gets value object for the given question.  Gives preference in the following order: the specific event, (global) questionsValues, (global) setInformationValues
 * @param {String} eventID eventID to look for the value in.
 * @param {String} questionID question ID to search for
 * @param {Array} sub_QIDs Additional questionID's for child objects of the questionID object, in genelogical order from parent to child.
 * @returns returns VALUE associated with the questionID/sub_QIDs...  This may come back as undefined, null, or empty objects as appropriate.  Calling function must handle any return errors.
 */
export const getQuestionValue = (eventID, questionID, ...sub_QIDs) => {
	// console.log("getQuestionValue(", eventID, questionID, ...sub_QIDs, ")");
	//TODO: look for dialog questions, system questions, handle tables

	let event = getEventFromID(eventID);
	let questionsData = getQuestionsData();

	let Qvalue;
	try {
		Qvalue = recursiveGetValue(questionsData[questionID].value, QUESTIONS_DATA_OBJECT_TYPE, _.cloneDeep(sub_QIDs));
	}
	catch (e) {
		if (e.name === "TypeError") {
			console.error("Attempted to get questionID '", questionID, "' that doesn't exist in questionsData.  All questionIDs should exist in questionsData.\n", e);
		}

	}


	if ((typeof Qvalue === 'undefined' || Qvalue === null) && questionID.startsWith(SET_INFORMATION_IDENTIFIER)) { // if questionsData came back with nothing, and it's looking for setInfo...
		Qvalue = recursiveGetValue(getSetInformationQuestionsData(), QUESTIONS_DATA_OBJECT_TYPE, _.cloneDeep(sub_QIDs))
	}

	let Evalue = recursiveGetValue(event.questionsValues, QUESTIONS_VALUES_OBJECT_TYPE, [questionID, ..._.cloneDeep(sub_QIDs)]);

	let retVal;
	if (typeof Qvalue === 'undefined') {
		retVal = Evalue;
	} else if (typeof Evalue === 'undefined') {
		retVal = Qvalue;
	} else if (Evalue === null && Qvalue !== null) {
		retVal = Qvalue;
	} else {
		retVal = Evalue;
	}

	return _.cloneDeep(retVal);
}

/**
 * @desc Converts sampling method values to one of three sampling method categories (EDI, EWI, OTHER)
 * @param {String or Int} methodValue that sampling method raw value
 * @return {String} appropriate enum string for the method category (EWI, EDI, or OTHER) 
 */
export const getMethodCategoryFromValue = (methodValue) => {

	switch (Number.parseInt(methodValue)) {
		case 10:
		case 15:
		case 1000:
		case 1010:
			return EWI_METHOD_CATEGORY;
		case 20:
			return EDI_METHOD_CATEGORY;
		default:
			return OTHER_METHOD_CATEGORY;
	}
}

/**
 * @desc Get the stationing-descriptive column for various combined tables
 * @param {string} eventID eventID to look in (does not check if loaded, nor does it error nicely)
 * @return {Array} Array of strings that describes each set/sample row in the event
 */
export const getDescriptiveColumnForTable = (eventID) => {
	let sampleEventLocations = [];
	let setList = getSetListAsArray(eventID);

	// let samplingMethod
	// let setType = getMethodCategoryFromValue(getQuestionValue(eventID, "samplingMethod")); //EDI, EWI, or OTHER

	setList.forEach((setName) => {
		let stationingColumn = 0;
		let shortSetName = setName.replace(SET_INFORMATION_IDENTIFIER, "");
		// console.log("realSetName: ", shortSetName);
		let numSamps = getNumberOfSamplesInSet(eventID, shortSetName);

		let samplesComposited = getQuestionValue(eventID, setName, "samplesComposited");
		// console.log(samplesComposited);
		let setLocations = [];
		if (!samplesComposited) { // samples will be analysized individually (and thus each sample needs it's own line)
			// console.log("Set " + shortSetName + " SAMPLES ARE NOT COMPOSITED");
			// let table_q_id = "set" + String.fromCharCode(65 + i) + "_samplesTable_" + setType;
			for (let i = 1; i <= numSamps; i++) {
				let location = 0;
				// if (setType === "EWI") { //TODO: this is probably a useless conditional now that the headers are the same
				// 	location = this.getTableQuestionValue(table_q_id, 0, k);
				// } else {
				// let bigLoc = getQuestionValue(eventID, setName, "samplesTable_EWI", i);
				// console.log("Big Loc: ", bigLoc);
				location = getQuestionValue(eventID, setName, "samplesTable_EWI", i, stationingColumn);
				// console.log("LOCATION for " + shortSetName + "[" + i + "]: ", location);
				// }

				setLocations.push(location);
			}
		} else {
			// console.log("Set " + shortSetName + " SAMPLES ARE COMPOSITED");
			setLocations.push("Comp"); // for a composite, there isn't really a 'location'
		}
		sampleEventLocations.push(setLocations);
	});

	// console.log(sampleEventLocations);

	let descColumn = [];

	// fill out the descColumn based on the sampleEventLoations generated above
	for (let i = 0; i < sampleEventLocations.length; i++) {
		let setName = setList[i].replace(SET_INFORMATION_IDENTIFIER, "");
		for (let k = 0; k < sampleEventLocations[i].length; k++) {

			switch (sampleEventLocations[i][k]) {
				case '':
				descColumn.push(setName + "-" + (k + 1));
					break;
				case "Comp":
				descColumn.push(setName + " Comp");
					break;
				default:
				descColumn.push(setName + "-" + (k + 1) + " @ " + sampleEventLocations[i][k]);
			}
		}
	}
	// push below the header
	descColumn.unshift(DESCRIPTION_HEADER);

	// console.log("FIRST COLUMN: ", firstColumn);
	return descColumn;

}




// export const getQuestionDataFromQuestionsDataByQuestionID = (questionsData, questionID) => {
// 	let DEBUG = false;

// 	if (DEBUG) console.log("--------------");
// 	if (DEBUG) console.log(questionsData);
// 	if (DEBUG) console.log("looking for questionID: ", questionID);

// 	let questionData = questionsData.filter(questionData => {

// 		// var areEqual = questionData.id.toUpperCase() === questionID.toUpperCase();
// 		// console.log(questionData.id + " " + areEqual);

// 		if (questionData.id === questionID) {
// 			if (DEBUG) console.log("Found");
// 			return questionData;
// 		}
// 		return null;
// 	}
// 	);

// 	if (DEBUG) console.log(questionData);

// 	if (questionData != null && questionData.length === 1) {

// 		return questionData[0];
// 	} else {
// 		return null; //TODO: throw errors
// 	}
// }

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

