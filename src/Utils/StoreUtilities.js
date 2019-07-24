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

export function getQuestionsData() {  //FUTURE: flesh out to allow getting full combined question data from other users
	let currentEventQD = {};
	let currentEventID = store.getState().SedFF.currentSamplingEventID;
	if(currentEventID) {
		currentEventQD = store.getState().SamplingEvents[currentEventID].questionsData;
	}
	
	let questionsData = store.getState().Questions.questionsData;

	return _.merge({}, questionsData, currentEventQD);
}


// function getQuestionFromQuestionID(questionID, store) {

// 	if (store.Questions.questionsData[questionID])
// 		return store.Questions.questionsData[questionID]
// 	else
// 		console.warn("Attempted to get question object for " + questionID + " but it does not exist in questionsData")
// 	return null;
// }
	/* 
	@desc gets the question object from questionsData in the store based on the ID
	@param questionID {string} - the question ID
	@param store {object} - the redux store object (likley returned from 'getState()' function)
	@returns question {object}.  If the object is not found, warns and returns null.
	*/
export function getQuestionDataFromID(QID) {  //FUTURE: flesh out to allow getting full combined question data from other users
	//TODO: build this recursively, like getQuestionValue, to work with nested questions?
	let questionsData = getQuestionsData();
	if (!questionsData[QID]) {
		console.warn("Attempted to get question Data on falsey question ID: ", QID);
	}
	return questionsData[QID];
}

export function getSetInformationQuestionsData() {
	return defaultSetInformationQuestionsData;
}

export function getAllUsersEventIDs(username) {  //TODO:  remove all for gramatical ease
	return store.getState().LinkTables.userEvents[username];
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
