import store from '../Store';
import _ from 'lodash';
import { defaultSetInformationQuestionsData } from '../Constants/DefaultObjects';
import { getQuestionValue } from '../Utils/QuestionUtilities';

import { SET_INFORMATION_IDENTIFIER, DATA_ENTRY_INFORMATION_IDENTIFIER, IDENTIFIER_SPLITTER, SEDIMENT_TYPES } from '../Constants/Config';
// import { eventNames } from 'cluster';

export function getNumberOfSets(eventID, sedType) {
	checkForValidSedimentType(sedType, "getNumberOfSets");

	return getSetListAsArray(eventID, sedType).length;
}

export function getNumberOfSamplesInSet(eventID, sedType, setID) {
	// console.log("getNumberOfSamplesInSet(", eventID, sedType, setID,")");
	let event = getEventFromID(eventID);
	if (!event) {
		throw new Error("eventID (", eventID, ") failed to return a valid event in getNumberOfSamplesInSet");
	}
	// if (setID.startsWith(SET_INFORMATION_IDENTIFIER)) {
	// 	return event.questionsValues[setID]["numberOfSamplingPoints"]
	// } else {

	let ret = event.questionsValues[DATA_ENTRY_INFORMATION_IDENTIFIER + sedType][setID]["numberOfSamplingPoints"];
	return ret;
	// }
}


/**
 * Provides full long-name list of sets for a given sediment type.  If the data entry information for that sediment type does not exist, warns and returns an empty array.
 * @param {string} eventID 
 * @param {string} sedType 
 */
export function getSetListAsArray(eventID, sedType) {
	checkForValidSedimentType(sedType, "getSetListAsArray");

	let event = getEventFromID(eventID);

	if (!event) {
		throw new Error("eventID (" + eventID + ") failed to return a valid event in getSetListAsArray");
	}

	let setListArr = [];
	let DEQV = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedType);

	try {
		setListArr = Object.keys(DEQV).filter((key) => { //TODO: change these to getQuestionValues
			return key.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER + sedType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER);
		})
	} catch (e) {
		console.warn("getSetListAsArray attempted to get a list of sets on a data entry type that didn't exist." + e + e.stackTrace());
		return [];
	}

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

export function checkForValidSedimentType(sedType, funcName) {
	if (!Object.keys(SEDIMENT_TYPES).includes(sedType)) {
		throw new Error("Invalid sediment type (" + sedType + ") provided to " + funcName);
	}
}

export function getEventFromID(eventID) {
	return store.getState().SamplingEvents[eventID]; //TODO: fail gracefully, attempt to fetch it??
}
export function getEventTemplateFromID(eventTemplateID) {
	return store.getState().EventTemplates[eventTemplateID]; //TODO: fail gracefully, attempt to fetch it??
}

/** 
@desc gets the combined current questionsData object - this is the combination of the currentSamplingEvent's, currentUser's, currentStation's... defaultSetInformation and the global default questionsData
@returns {object} combined questionsData object.
*/
export function getQuestionsData(eventID, fromGetQuestionValue) {  //OPTIMIZE:  THIS RUNS ALOT!
	let state = store.getState();

	// get USER questions data
	let currentUserQD = {};
	let username = state.SedFF.currentUsername;
	if (username) {
		currentUserQD = getUserQuestionData(username);
	} else {
		console.warn("Attempting to collecting user data without active username.")
	}

	// get EVENT questions data
	let currentEventQD = {};
	if (eventID) { // this might be run whn there is no current sampling event (ie: upon event creation)
		let event = getEventFromID(eventID);
		if (event) {
			currentEventQD = getEventQuestionData(event);
		}
	}
	
	// get STATION questions data
	let currentStationQD = {};
	// if (eventID && !fromGetQuestionValue && event) {  // get question value calls this... creating a infitite loop.  That said, I've removed (Nov 6, 2019) and see no ill effects.
	if (eventID && !fromGetQuestionValue) {
		let stationNameValue = getQuestionValue(eventID, 'stationName');
		if (stationNameValue && username) {
			currentStationQD = getStationNameQuestionData(username, stationNameValue);
		}
	}

	// let defaultSetInfoQD = getSetInformationQuestionsData();
	
	// let defaultWWInfoQD = _.clone(defaultWaterwayInfoQuestionsData);

	let defaultQD = store.getState().Questions.questionsData;

	// return _.merge({}, defaultQD, defaultSetInfoQD, defaultWWInfoQD, currentUserQD, currentStationQD, currentEventQD);  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
	// let bigQD = _.merge({}, defaultQD, defaultSetInfoQD, currentUserQD, currentStationQD, currentEventQD);  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
	let bigQD = _.merge({}, defaultQD, currentUserQD, currentStationQD, currentEventQD);  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
	// console.log('bigQD :', bigQD);
	return bigQD;  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
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
	if (!username) {
		throw new Error("Requested username '" + username + "' was falsey with type of: " + typeof username);
	}
	if (!stationName) {
		throw new Error("Requested stationName '" + stationName + "' was falsey with type of: " + typeof stationName);
	}

	let stationIDsWithMatchingNames = getStationIDsFromName(username, stationName);
	if (stationIDsWithMatchingNames.length < 1) {
		console.warn("No Station IDs matched ' ", stationName, "' for username '", username, "'");
		return undefined;
	}

	if (stationIDsWithMatchingNames.length > 1) {
		console.warn("Multiple Station IDs matched ' ", stationName, "' for username '", username, "'");
	}

	return getStationIDQuestionData(stationIDsWithMatchingNames[0]); //FUTURE: return the first one now... should we warn or offer option? 
}

/**
 * @param {string} stationID - the name of the station
 * @returns {Object} the questionsData (custom questions) for a given stationID
 */
export function getStationIDQuestionData(stationID) {
	if (!stationID) {
		throw new Error("Requested stationID '" + stationID + "' was falsey with type of: " + typeof stationID);
	}
	let station = getStationFromID(stationID);

	if (!station) {
		console.warn("Requested station '" + station + "' was falsey with type of: " + typeof station + ".  Returning undefined questionsData");
		return undefined;
	} else {
		return getStationQuestionData(station);
	}

}

/**
 * @param {string} station - station object
 * @returns {Object} the questionsData (custom questions) for a given station
 */
export function getStationQuestionData(station) {
	if (!station) {
		throw new Error("Requested station '" + station + "' was falsey with type of: " + typeof station);
	}
	return station.questionsData;
}



/** 
@desc gets the question object from questionsData in the store based on the ID
@param {string} eventID  - the eventID
@param {string} questionID  - the question ID - can be multiple
@returns {object} question .  If the object is not found, warns and returns null.
*/
export function getQuestionDataFromID(eventID, ...QIDs) {
	//TODO: build this recursively, like getQuestionValue, to work with nested questions?

	let questionsData = getQuestionsData(eventID);

	if (!questionsData[QIDs[0]]) {
		console.warn("Attempted to get question Data on falsey question ID: ", QIDs, "QuestionsData: ", questionsData);
	}
	return recursiveGetQuestionDataFromID(questionsData, ...QIDs);
	// return questionsData[QIDs[0]];
}

export function recursiveGetQuestionDataFromID(questionsData, ...QIDs) {
	if (QIDs.length > 1) {
		console.warn("This part of recursiveGetQuestionDataFromID is untested.")
		return recursiveGetQuestionDataFromID(questionsData[QIDs.shift()], QIDs)
	}
	return questionsData[QIDs[0]];
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

export function getSamplingEventsLinkTable(username) {
	return store.getState().SamplingEventsLinkTables[username];
}

export function getStationsLinkTable(username) {
	return store.getState().StationsLinkTables[username];
}

export function getAllUsersEventIDs(username) {  //TODO:  remove all for gramatical ease   
	if (typeof getSamplingEventsLinkTable(username) === 'undefined') {
		return [];
	}
	let evts = getSamplingEventsLinkTable(username).events;
	if (typeof evts === 'undefined') {
		return [];
	}
	return evts;
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
	if (!stationID) {
		throw new Error("Requested stationID '" + stationID + "' was falsey with type of: " + typeof stationID);
	}
	return store.getState().Stations[stationID];
}

export function getStationIDsFromName(username, stationName) {	//find station number
	if (!getStationsLinkTable(username)) {
		return null;
	}
	let stationIDList = getStationsLinkTable(username).stations;
	if (!stationIDList) {
		//TODO: trigger network? (switch this and ande events to promises?)
		console.warn("User, " + username + ", has no stations in stations.");
		return null;
	}

	let matchingIDs = stationIDList.filter((stationID) => {
		return store.getState().Stations[stationID].name === stationName
	})
	if (matchingIDs.length > 1) {
		console.warn("Multiple ID's ", matchingIDs, " matched that station name.  This could represent a bug, please contact jfederer@usgs.gov and include this message");
	}
	if (matchingIDs.length < 1) {
		//TODO: trigger network?
		console.warn("No matching station ID's found for station name, ", stationName, ". This could represent a bug, please contact jfederer@usgs.gov and include this message");
	}
	return matchingIDs;
}
