import store from '../Store';
import _ from 'lodash';
import { defaultSetInformationQuestionsData } from '../Constants/DefaultObjects';


import { SET_INFORMATION_IDENTIFIER } from '../Constants/Config';

export function getNumberOfSets(eventID) {
	return getSetListAsArray(eventID).length;
}

export function getNumberOfSamplesInSet(eventID, setID) {
	let event = getEventFromID(eventID);
	if (!event) {
		throw new Error("eventID (", eventID, ") failed to return a valid event in getNumberOfSamplesInSet");
	}
	if (setID.startsWith(SET_INFORMATION_IDENTIFIER)) {
		return event.questionsValues[setID]["numberOfSamplingPoints"]
	} else {
		return event.questionsValues[SET_INFORMATION_IDENTIFIER + setID]["numberOfSamplingPoints"]
	}
}

export function getSetListAsArray(eventID) {
	let event = getEventFromID(eventID);

	if (!event) {
		throw new Error("eventID (", eventID, ") failed to return a valid event in getSetListAsArray");
	}

	let setListArr = [];
	setListArr = Object.keys(event.questionsValues).filter((key) => { //TODO: change these to getQuestionValues
		return key.startsWith(SET_INFORMATION_IDENTIFIER);
	})
	return setListArr;
}

export function getSetListAsObject(eventID) {
	let setListObj = {};
	getSetListAsArray(eventID).forEach(qid => {
		setListObj[qid.split(SET_INFORMATION_IDENTIFIER)[1]] = qid;
	});
	return setListObj;
}

export function getEventFromID(eventID) {
	return store.getState().SamplingEvents[eventID];
}

/** 
@desc gets the combined current questionsData object - this is the combination of the currentSamplingEvent's, currentUser's, currentStation's and the default questionsData
@returns {object} combined questionsData object.
*/
export function getQuestionsData() {  //OPTIMIZE:  THIS RUNS ALOT!
	let state = store.getState();

	let currentUserQD = {};
	let username = state.SedFF.currentUsername;
	if (username) {
		currentUserQD = state.Users[username].settings.questionsData;
	}

	let currentEventQD = {};
	let currentStationQD = {};
	let currentEventID = state.SedFF.currentSamplingEventID;
	let currentEvent = state.SamplingEvents[currentEventID]; //note, currentEvent is used below to get stationName
	if (currentEvent) {
		currentEventQD = currentEvent.questionsData;
		let stationNameValue = currentEvent.questionsValues['stationName'];
		if (stationNameValue && username) {
			let currentStation = getStationFromID(getStationIDsFromName(username, stationNameValue)[0]);
			currentStationQD = currentStation.questionsData;
		}
	}

	let defaultQD = store.getState().Questions.questionsData;

	return _.merge({}, defaultQD, currentUserQD, currentStationQD, currentEventQD);  //OPTIMIZE:  This is likely an expensive way of combining these. May make sense to combine into a single 'master/current' questionsData set in the store when adding/removing questions
}


/** 
@desc gets the question object from questionsData in the store based on the ID
@param {string} questionID  - the question ID
@returns {object} question .  If the object is not found, warns and returns null.
*/
export function getQuestionDataFromID(QID) {
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
