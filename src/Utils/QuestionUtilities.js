import React from 'react'; //lets me use JSX
import Question from '../Components/Question';
import { Grid } from '@material-ui/core';
import _ from 'lodash';
import { getEventFromID, getQuestionsData, getSetListAsArray, getNumberOfSamplesInSet, checkForValidSedimentType } from './StoreUtilities';
import {
	DATA_ENTRY_INFORMATION_IDENTIFIER, QUESTIONS_DATA_OBJECT_TYPE, QUESTIONS_VALUES_OBJECT_TYPE,
	EDI_METHOD_CATEGORY, EWI_METHOD_CATEGORY, OTHER_METHOD_CATEGORY, IDENTIFIER_SPLITTER, DATA_ENTRY_SAMPLES_TABLE_STATIONING_COLUMN_NUMBER,
	METHOD_QIDS
} from '../Constants/Config';
import { DESCRIPTION_HEADER } from '../Constants/Dictionary';
import { getShortSetNameFromFullSetName } from '../Utils/Utilities';
import { NOT_SAMPLED } from '../Constants/Dictionary';

export const createQuestionComponents = (questionsData, questionsValues, alternateChangeHandler, opts) => {

	if(typeof opts === "undefined") {
		opts = {}
	}
	// console.log("createQuestionComponents(\n\tQuestionsData: ", questionsData, "\n\tQuestionsValues ", questionsValues, "\n\tAltChangeHandler: ", alternateChangeHandler, opts, ")");
	// creates one question component for every question in questionsData
	// if value exists in currentSamplingEvent, this value takes precidence over value from questionsData
	// returns array of question components

	let questionComponents = [];
	if (questionsData !== null && questionsData.length > 0) {  //TODO: add error
		questionComponents = questionsData.map(questionData => {
			let value = questionData.value;
			if (opts.debug) console.log("CREATEQ: First Assigned: ", value);
			if (opts.debug) console.log("CREATEQ: questionsVallues: ", questionsValues);
			if (opts.debug) console.log("CREATEQ: questionData.id: ", questionData.id);
			if (opts.debug) console.log("CREATEQ: questionsValues[questionData.id]: ", questionsValues[questionData.id]);
			if (questionsValues[questionData.id] !== null && typeof questionsValues[questionData.id] !== 'undefined') {
				// question exists in questionsValues.  Note, keep not-equal-to-null, as the questionValue can be a boolean and break stuff
				value = questionsValues[questionData.id];
				if (opts.debug) console.log("CREATEQ: OVERWRITE WITH: ", value);
			}

			let retQ = <Question {...questionData} {...opts.props}
				value={value}
				key={questionData.id["key"] ? questionData.id["key"] : questionData.id}
				alternateChangeHandler={alternateChangeHandler} />;
			if (opts.debug) console.log("CREATEQ: VALUE AT RETURN: ", value);
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
	let DEBUG = false;
	// console.log("recursiveGetValue(", "Haystack: ", haystack, haystackType, sub_QIDs, ")");

	if (haystack === null) {
		if (DEBUG) console.log("returning null");
		return null;
	}

	if (typeof haystack === 'undefined') {
		if (DEBUG) console.log("returning undefined");
		return undefined;
	}

	if (sub_QIDs.length < 1) {
		if (haystackType === QUESTIONS_DATA_OBJECT_TYPE) {
			if (DEBUG) console.log("returning : ", haystack.value);
			return haystack.value;
		} else {
			if (DEBUG) console.log("returning : ", haystack);
			return haystack;
		}
	}

	if (DEBUG) console.log("returning RECURSINON!");
	return recursiveGetValue(haystack[sub_QIDs.shift()], haystackType, sub_QIDs);
}


/**
 * @desc gets value object for the given question.  Gives preference in the following order: the specific event values, (global) questionsData values, (global) dataEntryData values, (global) setInformation values
 * @param {String} eventID eventID to look for the value in.
 * @param {String} questionID question ID to search for
 * @param {Array} sub_QIDs Additional questionID's for child objects of the questionID object, in genelogical order from parent to child.
 * @returns returns VALUE associated with the questionID/sub_QIDs...  This may come back as undefined, null, or empty objects as appropriate.  Calling function must handle any return errors.
 */
export const getQuestionValue = (eventID, questionID, ...sub_QIDs) => {
	let DEBUG = false;
	// console.log("getQuestionValue(", eventID, questionID, ...sub_QIDs, ")");
	if (DEBUG) console.log("FUNC: getQuestionValue(", eventID, questionID, ...sub_QIDs, ")");
	//TODO: look for dialog questions, system questions


	let event = getEventFromID(eventID);

	let questionsData = getQuestionsData(eventID, true);  // questions data is a combo of global questionsData, currentEvent, currentUser, and currentStation questionsData

	if (DEBUG) console.log('getQuestionValue: questionsData :', questionsData);

	// Try to get value from questionsData (global)
	let QDvalue;
	try {
		// note, questionsData[questionID] being undefined here is perfectly reasonable.
		QDvalue = recursiveGetValue(questionsData[questionID], QUESTIONS_DATA_OBJECT_TYPE, _.cloneDeep(sub_QIDs));  //TODO: should this be QUESTIONS_VALUES_OBJECT_TYPE?
	}
	catch (e) {
		if (e.name === "TypeError") {
			console.error("Attempted to get questionID '", questionID, "' that doesn't exist in questionsData.  All questionIDs should exist in questionsData.\n", e);
		}

	}

	if (DEBUG) console.log('getQuestionValue: QDvalue pre special cases:', QDvalue);

	// try {
	// if ((typeof QDvalue === 'undefined' || QDvalue === null) && questionID.startsWith(SET_INFORMATION_IDENTIFIER)) { // if questionsData came back with nothing, and it's looking for setInfo... //FIXME: likely not right anymore
	// 	if (DEBUG) console.log("Looking at set entry information... QD: ", questionsData);
	// 	QDvalue = recursiveGetValue(getSetInformationQuestionsData(), QUESTIONS_DATA_OBJECT_TYPE, _.cloneDeep(sub_QIDs))
	// 	if (DEBUG) console.log('getQuestionValue: QDvalue post SET INFORMATION:', QDvalue);
	// }

	if ((typeof QDvalue === 'undefined' || QDvalue === null) && questionID.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER)) { // if questionsData came back with nothing, and it's looking for data entry.  Data entry->sets are in the event custom questions list ...

		if (DEBUG) console.log("Looking at data entry information... QD: ", questionsData);

		QDvalue = recursiveGetValue(questionsData, QUESTIONS_DATA_OBJECT_TYPE, _.cloneDeep(sub_QIDs))
		// if((typeof QDvalue === 'undefined' || QDvalue === null) && sub_QIDs[0].startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER) && sub_QIDs.length>1) {
		// 	QDvalue == questionsData[sub_QID]
		// }

		if (DEBUG) console.log('getQuestionValue: QDvalue post DATA ENTRY INFORMATION:', QDvalue);
	}


	// } catch (e) {
	// 	console.err("Error came from: getQuestionValue(", eventID, questionID, ...sub_QIDs, ")");
	// 	throw e;
	// }

	if (DEBUG) console.log('getQuestionValue: QDvalue Post special:', QDvalue);

	let Evalue = recursiveGetValue(event.questionsValues, QUESTIONS_VALUES_OBJECT_TYPE, [questionID, ..._.cloneDeep(sub_QIDs)]);

	if (DEBUG) console.log('getQuestionValue: Evalue :', Evalue);


	let retVal;
	if (typeof QDvalue === 'undefined') {
		retVal = Evalue;
	} else if (typeof Evalue === 'undefined') {
		retVal = QDvalue;
	} else if (Evalue === null && QDvalue !== null) {
		retVal = QDvalue;
	} else {
		retVal = Evalue;
	}

	if (DEBUG) console.log('getQuestionValue: retVal :', retVal);
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
 * @param {string} sedType sediment type to provide column for
 * @return {Array} Array of strings that describes each set/sample row in the event
 */
export const getDescriptiveColumnForTable = (eventID, sedType) => {
	checkForValidSedimentType(sedType, "getDescriptiveColumnForTable");

	let sampleEventLocations = [];
	let setList = getSetListAsArray(eventID, sedType);

	setList.forEach((setName) => {
		let numSamps = getNumberOfSamplesInSet(eventID, sedType, setName);
		let samplesComposited = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER+sedType, setName, "samplesComposited");

		let setLocations = [];
		if (!samplesComposited) { // samples will be analysized individually (and thus each sample needs it's own line)
			for (let i = 1; i <= numSamps; i++) {
				let location = 0;
				let methodCategory = getMethodCategoryFromValue(getQuestionValue(eventID, METHOD_QIDS[sedType]));

				location = getQuestionValue(eventID, setName.split(IDENTIFIER_SPLITTER)[0], setName, "samplesTable_" + methodCategory + "_" + sedType, i, DATA_ENTRY_SAMPLES_TABLE_STATIONING_COLUMN_NUMBER);
				setLocations.push(location);
			}
		} else {
			setLocations.push("Comp"); // for a composite, there isn't really a 'location'
		}
		sampleEventLocations.push(setLocations);
	});

	let descColumn = [];

	// fill out the descColumn based on the sampleEventLocations generated above
	for (let i = 0; i < sampleEventLocations.length; i++) {
		let setName = setList[i];
		for (let k = 0; k < sampleEventLocations[i].length; k++) {
			switch (sampleEventLocations[i][k]) {
				case '':
					descColumn.push(getShortSetNameFromFullSetName(setName) + "-" + (k + 1));
					break;
				case "Comp":
					descColumn.push(getShortSetNameFromFullSetName(setName) + " Comp");
					break;
				default:
					descColumn.push(getShortSetNameFromFullSetName(setName) + "-" + (k + 1) + " @ " + sampleEventLocations[i][k]);
			}
		}
	}
	// push below the header
	descColumn.unshift(DESCRIPTION_HEADER);

	return descColumn;
}

export function getActiveSedimentTypes(eventID) {
	return Object.keys(METHOD_QIDS).filter(sedType => {
		if (getQuestionValue(eventID, METHOD_QIDS[sedType]) !== NOT_SAMPLED) {
			return true;
		}
		return false;
	});
}

export const getTabQuestionsData = (questionsData, tabName) => {
	//given OBJECT questionsData and STRING tabName... 
	//... will return all questionsData objects where question.tabName matches tabName
	let tabQuestionsData = [];
	Object.keys(questionsData).forEach(key => {
		try {
			if (questionsData[key].tabName.replace(/ /g, '').toUpperCase() === tabName.replace(/ /g, '').toUpperCase()) {
				tabQuestionsData.push(questionsData[key]);
			}
		}
		catch (e) {
			// if (e instanceof TypeError) {
			// 	if (!key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER))
			// 		console.debug("tabName did not exist for questionsData[", key, "]: ", questionsData[key]);
			// }

		}
	});
	return tabQuestionsData;
}

export const getLayoutGroupNames = (questionsData) => {
	// provided with ARRAY questionData, will return array of layout group names (strings)
	let layoutGroupNames = [];

	if (!_.isEmpty(questionsData) && questionsData.length > 0) {  //TODO: add error
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



// export const saveQuestionValueToLS = (Q) => {
// 	//this function saves updated question "values" (must be located at "Q.state.value") to localStorage.questionsData
// 	// returns updated questionsData object
// 	//console.log("getQuestionDataWithUpdatedValue", Q.state.value);
// 	var DEBUG = false;
// 	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q: ", Q);
// 	if (Q == null) { //POC
// 		console.log("Question passed to getQuestionDataWithUpdatedValue was null or undefined");
// 		return;
// 	}

// 	// get the questions in localStorage
// 	var questionsDataFromLS = JSON.parse(localStorage.getItem('questionsData'));
// 	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionsDataFromLS: ", questionsDataFromLS);

// 	// find the specific question in questionsDataFromLS based on the id,then update the value property
// 	var newQuestionsData = questionsDataFromLS.filter(questionData => {
// 		//if (DEBUG) console.log("saveQuestionValueToLS: ", questionData.id + " === " + Q.props.id);
// 		if (questionData.id === Q.props.id) {
// 			if (DEBUG) console.log("------FOUND!--------");
// 			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (pre): ", questionData);
// 			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: Q.state.value", Q.state.value);
// 			questionData.value = Q.state.value;
// 			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: questionData (post)", questionData);

// 		} else {
// 			if (DEBUG) console.log("getQuestionDataWithUpdatedValue: no");
// 		}
// 		return questionData;
// 	});

// 	if (DEBUG) console.log("getQuestionDataWithUpdatedValue: newQuestionsData: ", newQuestionsData);

// 	// replace the questionData in localStorage
// 	localStorage.setItem('questionsData', JSON.stringify(newQuestionsData));

// }

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

