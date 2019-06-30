import store from '../Store';
import { defaultSetInformationQuestionsData } from '../Constants/DefaultObjects';

import { SET_INFORMATION_IDENTIFIER } from '../Constants/Config';

export function getNumberOfSets(eventID) {
	let event = getEventFromID(eventID); //TODO: change to "getEvent"

	let num = Object.keys(event.questionsValues).filter((key) => {  //TODO: change these to getQuestionValues
		return key.startsWith(SET_INFORMATION_IDENTIFIER);
	}).length;
	return num;
}

export function getSetListAsArray(eventID) {
	let event = getEventFromID(eventID);  //TODO: change to "getEvent"

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
	return store.getState().Questions.questionsData;
}

export function getQuestionDataFromID(QID) {  //FUTURE: flesh out to allow getting full combined question data from other users
	//TODO: build this recursively, like getQuestionValue, to work with nested questions?
	if (!store.getState().Questions.questionsData[QID]) {
		console.warn("Attempted to get question Data on falsey question ID: ", QID);
	}
	return store.getState().Questions.questionsData[QID];
}

export function getSetInformationQuestionsData() {
	return defaultSetInformationQuestionsData;
}

export function getAllUsersEventIDs(username) {
	return store.getState().LinkTables.userEvents[username];
}
