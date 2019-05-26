import _ from 'lodash';
import uuidv4 from 'uuid';

import {
	CREATE_NEW_SAMPLING_EVENT,
	REGISTER_EVENT_WITH_USERNAME,
	SE_QUESTION_VALUE_CHANGE,
	SHOW_PANELS,
	HIDE_PANELS,
	SHOW_NAVIGATION_TABS,
	HIDE_NAVIGATION_TABS,
	SHOW_QUESTIONS,
	HIDE_QUESTIONS
} from '../Constants/ActionTypes';
import { emptySamplingEvent } from '../Constants/DefaultObjects';


export function SEQuestionValueChange(eventID, questionID, newValue) {  //TODO: add something in for non-Sampling-Events quetions (settings, etc)
	/* 
	@desc changes value of a question in a given event to a new value.  Then runs any actions associated with that question ('anyValue' first, then the given value). 
	@param eventID {string} - the unique event ID.
	@param questionID {string} - the question ID.  If this does not exist in the event, the key will be created and given a value in the questionsValues.
	@param newValue {any} - the value to assign to the question
	@returns void
	*/
	// console.log("SEQuestionVAlueChange(eventID: ", eventID, "  questionID: ", questionID, "  newValue: ", newValue);

	return (dispatch, getState) => {
		dispatch({ type: SE_QUESTION_VALUE_CHANGE, eventID, questionID, newValue });

		//get question and conditionally the action string
		let question = getQuestionFromQuestionID(questionID, getState());
		if (question) {
			let actions = question.actions;
			if (actions) {
				// if action string exists...
				let anyValueActionString = actions["anyValue"];
				if (anyValueActionString) {
					// run 'anyValue' action strings first
					dispatchAllActionsFromActionString(dispatch, anyValueActionString);
				}

				let thisValueActionString = actions[newValue];
				if (thisValueActionString) {
					// run this specific value's action string second
					dispatchAllActionsFromActionString(dispatch, thisValueActionString);
				}
			}
		}
	}
}

export function createNewSampingEventForUser(eventName, username) {
	/* 
	@desc creates a new sampling event from scratch and links it to a given user
	@param eventName {string} - the event name.  If empty string, will be given date-based name
	@param username {string} - the user name to link the event to.
	@returns the eventID of the newly created event 
	*/

	if (!username) {
		throw new Error("No username passed to createNewSamplingEventForUser function");
	}

	return dispatch => {
		let eventID = dispatch(createNewSamplingEvent(eventName));
		dispatch({ type: REGISTER_EVENT_WITH_USERNAME, eventID, username });
		return eventID;
	}
}

export function createNewSamplingEvent(eventName) {
	/* 
	@desc syncronous function creates new, blank event based on template
	@param eventName {string} - the new event name.  If empty string, will be given date-based name
	@returns the eventID of the newly created event  (note, up to the reciever to link user and event in eventLinkTable)
	*/
	return dispatch => {
		let newEvent = _.cloneDeep(emptySamplingEvent);
		newEvent.eventID = uuidv4();
		if (!eventName) { // if no event name give, the event name will be the date //FUTURE: build a setting for the default event name
			let today = new Date();
			let monthName = today.toLocaleString('en-us', { month: 'long' });
			let dd = String(today.getDate()).padStart(2, '0');
			let yyyy = today.getFullYear();

			eventName = "Sampling Event on " + yyyy + " " + monthName + " " + dd;
		}

		newEvent.eventName = eventName;  //OPTIMIZE: should be calling setEventName action instead?

		newEvent.dateModified = new Date().toString(); //OPTIMIZE: should be calling eventModified action instead?

		//OPTIMIZE: call an optional callback 

		dispatch({ type: CREATE_NEW_SAMPLING_EVENT, event: newEvent });
		return (newEvent.eventID);
	}
}



function getActionsFromActionString(actionsString) {
	/* 
	@desc splits an action string up in to constituent parts.  Combines all like-actions.
	@param actionString {string} - string with actions delimited by ampersand (&) and actions split from action parameters by double-colon (::)
	@returns actions {object}, where action[actionName] is an array of arrays of that action's parametes.
	*/

	let actionsArr = actionsString.split('&');
	let actions = {};
	actionsArr.map((actionString) => {
		let actionParameters = actionString.split('::');
		let actionName = actionParameters.splice(0, 1);

		if (typeof actions[actionName] === 'undefined') {
			actions[actionName] = [actionParameters];
		} else {
			actions[actionName].push(actionParameters);
		}
		return null;
	}
	);
	return actions;
}


function getQuestionFromQuestionID(questionID, store) {
	/* 
	@desc gets the question object from questionsData in the store based on the ID
	@param questionID {string} - the question ID
	@param store {object} - the redux store object (likley returned from 'getState()' function)
	@returns question {object}.  If the object is not found, warns and returns null.
	*/
	if (store.Questions.questionsData[questionID])
		return store.Questions.questionsData[questionID]
	else
		console.warn("Attempted to get question object for " + questionID + " but it does not exist in questionsData")
	return null;
}

function translateActionStringActionNameToAction(sedFFActionName) {
	/* 
	@desc translates between SedFF action names and redux action names. //FUTURE: switch sedFF action names to match redux action names?
	@param sedFFActionName {string} the sedFF action name... found in 'actions' object as a part of each question object
	@returns redux-equivalent action {string}.  If non found, warns and returns null.
	*/
	switch (sedFFActionName) {
		case "ShowTab":
			return SHOW_NAVIGATION_TABS;
		case "HideTab":
			return HIDE_NAVIGATION_TABS;
		case "ShowQuestion":
			return SHOW_QUESTIONS
		case "HideQuestion":
			return HIDE_QUESTIONS;
		case "ShowPanel":
			return SHOW_PANELS;
		case "HidePanel":
			return HIDE_PANELS;
		// case "SetValue":
		// 	// let qid = splitActionString[1].split(":")[0];
		// 	// let val = splitActionString[1].split(":")[1];
		// 	// this.setQuestionValue(qid, val, () => console.log("Set Value!"));
		// 	console.log("SET VALUE: TODO"); //TODO:
		// 	break;
		default:
			console.warn("Requested action '" + sedFFActionName + "' not recognized");
			return null;
	}
}

function dispatchAllActionsFromActionString(dispatch, actionString) {
	/* 
	@desc dispatches all actions included in the action string.
	@param dispatch {function} the redux-thunk dispatch function
	@param actionString {string} the sedFF action action string.  it will be split up and translated in order to dispatch.
	@returns {void}
	*/
	let actionsToDispatch = getActionsFromActionString(actionString);
	Object.keys(actionsToDispatch).forEach((sedFFActionName) => {
		dispatch({ type: translateActionStringActionNameToAction(sedFFActionName), payload: actionsToDispatch[sedFFActionName] });
	});
}