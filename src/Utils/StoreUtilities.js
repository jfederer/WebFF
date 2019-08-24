import store from '../Store';
import _ from 'lodash';
import { defaultSetInformationQuestionsData } from '../Constants/DefaultObjects';
import { getQuestionValue } from '../Utils/QuestionUtilities';

import { SET_INFORMATION_IDENTIFIER, DATA_ENTRY_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER, SEDIMENT_TYPES} from '../Constants/Config';
// import { eventNames } from 'cluster';

export function getNumberOfSets(eventID, sedType) {
	checkForValidSedimentType(sedType, "getNumberOfSets");

	return getSetListAsArray(eventID, sedType).length;
}

export function getNumberOfSamplesInSet(eventID, sedType, setID) {
	console.log("getNumberOfSamplesInSet(", eventID, sedType, setID,")");
	let event = getEventFromID(eventID);
	if (!event) {
		throw new Error("eventID (", eventID, ") failed to return a valid event in getNumberOfSamplesInSet");
	}
	// if (setID.startsWith(SET_INFORMATION_IDENTIFIER)) {
	// 	return event.questionsValues[setID]["numberOfSamplingPoints"]
	// } else {

		let ret = event.questionsValues[DATA_ENTRY_INFORMATION_IDENTIFIER+sedType][SET_INFORMATION_IDENTIFIER + setID]["numberOfSamplingPoints"];
		console.log("Returning: ", ret);
		return ret;
	// }
}

export function getSetListAsArray(eventID, sedType) {
	checkForValidSedimentType(sedType, "getSetListAsArray");
	
	let event = getEventFromID(eventID);

	if (!event) {
		throw new Error("eventID (", eventID, ") failed to return a valid event in getSetListAsArray");
	}

	let setListArr = [];
	let DEQV = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER+sedType);

	setListArr = Object.keys(DEQV).filter((key) => { //TODO: change these to getQuestionValues
		return key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER+sedType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER);
	})
	return setListArr;
}

export function getSetListAsObject(eventID, sedType) {
	checkForValidSedimentType(sedType, "getSetListAsObject");
	let setListObj = {};
	getSetListAsArray(eventID, sedType).forEach(qid => {
		setListObj[qid.split(SET_INFORMATION_IDENTIFIER)[1]] = qid;
	});
	return setListObj;
}

function checkForValidSedimentType(sedType, funcName) {
	if(!Object.keys(SEDIMENT_TYPES).includes(sedType)) {
		throw new Error("Invalid sediment type (" + sedType + ") provided to " + funcName);
	}
}

export function getEventFromID(eventID) {
	return store.getState().SamplingEvents[eventID];
}

/** 
@desc gets the combined current questionsData object - this is the combination of the currentSamplingEvent's, currentUser's, currentStation's and the default questionsData
@returns {object} combined questionsData object.
*/
export function getQuestionsData() {  //OPTIMIZE:  THIS RUNS ALOT! //TODO: add eventID
	let state = store.getState();

	let currentUserQD = {};
	let username = state.SedFF.currentUsername;
	if (username) {
		currentUserQD = getUserQuestionData(username);
	}

	let currentEventQD = {};
	let currentStationQD = {};
	let currentEventID = state.SedFF.currentSamplingEventID;
	let currentEvent = state.SamplingEvents[currentEventID]; //note, currentEvent is used below to get stationName
	if (currentEvent) {
		currentEventQD = getEventQuestionData(currentEvent);
		
		let stationNameValue = currentEvent.questionsValues['stationName'];
		if (stationNameValue && username) {
			currentStationQD = getStationNameQuestionData(username, stationNameValue);
		}
	}

	let defaultQD = store.getState().Questions.questionsData;

	return _.merge({}, defaultQD, currentUserQD, currentStationQD, currentEventQD);  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
}

/**
 * @param {string} username - username (email)
 * @returns {Object} the questionsData (custom questions) for a given user
 */
export function getUserQuestionData(username) {
	return store.getState().Users[username].settings.questionsData;;
}

/**
 * @param {string} eventID - event ID for a given event
 * @returns {Object} the questionsData (custom questions) for a given event associated with the eventID
 */
export function getEventIDQuestionData(eventID) {
	return getEventQuestionData(store.getState().SamplingEvents[eventID]);
}

/**
 * @param {Object} event - sampling event object
 * @returns {Object} the questionsData (custom questions) for a given event
 */
export function getEventQuestionData(event) {
	return event.questionsData;
}


/**
 * @param {string} username - the name of a user (email) associated with the station
 * @param {string} stationName - the name of the station (this is the full station name (ie: the station name 'value', not the key), not the display name)
 * @returns {Object} the questionsData (custom questions) for a given stationName
 */
export function getStationNameQuestionData(username, stationName) {
	return getStationIDQuestionData(getStationIDsFromName(username, stationName)[0]);
}

/**
 * @param {string} stationID - the name of the station
 * @returns {Object} the questionsData (custom questions) for a given stationID
 */
export function getStationIDQuestionData(stationID) {
	return getStationQuestionData(getStationFromID(stationID));
}

/**
 * @param {string} station - station object
 * @returns {Object} the questionsData (custom questions) for a given station
 */
export function getStationQuestionData(station) {
	return station.questionsData;
}



/** 
@desc gets the question object from questionsData in the store based on the ID
@param {string} questionID  - the question ID
@returns {object} question .  If the object is not found, warns and returns null.
*/
export function getQuestionDataFromID(QID) { //TODO: add eventID
	//TODO: build this recursively, like getQuestionValue, to work with nested questions?
	
	let questionsData = getQuestionsData();

	if (!questionsData[QID]) {
		console.warn("Attempted to get question Data on falsey question ID: ", QID, "QuestionsData: ", questionsData);
	}
	return questionsData[QID];
}

export function getSetInformationQuestionsData() {
	return defaultSetInformationQuestionsData;
}

// export function getDataEntrySheetQuestionsData(sedimentType) {
// 	let DES_QD = _.cloneDeep(defaultDateEntrySheetQuestionsData);
// 	let retQD = DES_QD.Common;
// 	Object.keys(DES_QD[sedimentType]).forEach(key=>{
// 		retQD[key]=DES_QD[sedimentType][key];
// 	})
	

// 	console.log('retQD :', retQD);
// 	//tood check we are getting appropriate sediment type input
	
// 	return retQD;
// }

export function getAllUsersEventIDs(username) {  //TODO:  remove all for gramatical ease
	return store.getState().LinkTables.userEvents[username];
}

export function getCurrentStationID() {
	let state = store.getState();
	try {
		let username = state.SedFF.currentUsername;
		let currentEvent = state.SamplingEvents[state.SedFF.currentSamplingEventID];
		let stationNameValue = currentEvent.questionsValues['stationName'];
		return getStationIDsFromName(username, stationNameValue)[0];
	} catch {
		return null;
	}
}

export function getStationFromID(stationID) {
	return store.getState().Stations[stationID];
}

export function getStationIDsFromName(username, stationName) {	//find station number
	// console.log("getStationIDsFromName(", username, ",", stationName, ")");
	let stationIDList = store.getState().LinkTables.userStations[username];
	let matchingIDs = stationIDList.filter((stationID) => {
		return store.getState().Stations[stationID].name === stationName
	})
	if (matchingIDs.length > 1) {
		console.warn("Multiple ID's ", matchingIDs, " matched that station name.  This could represent a bug, please contact jfederer@usgs.gov and include this message");
	}
	return matchingIDs;
}
