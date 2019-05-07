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

	console.log("SEQuestionVAlueChange(eventID: ", eventID, "  questionID: ", questionID, "  newValue: ", newValue);
	return (dispatch, getState) => {
		dispatch({ type: SE_QUESTION_VALUE_CHANGE, eventID, questionID, newValue });

		//get action string
		let question = getQuestionFromQuestionID(questionID, getState());
		if (question) {
			console.log("question " + questionID + " Found: ", question);
			let actions = question.actions;
			if (actions) {
				// if action string exists...
				console.log("actions exist!: ", actions);

				let anyValueActionString = actions["anyValue"];
				if (anyValueActionString) {
					console.log("AnyValue exists: ", anyValueActionString);
					//TODO: run anyValueActionString
					dispatchAllActionsFromActionString(dispatch, anyValueActionString);
				}

				let thisValueActionString = actions[newValue];
				if (thisValueActionString) {
					console.log("Action for " + newValue + " exists: ", thisValueActionString);
					//TODO: run thisValueActionString
					dispatchAllActionsFromActionString(dispatch, thisValueActionString);
				}
			}
		} else {
			//TODO: Error  (should always find a question)
			console.log("Question not found... error!");
		}
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


export function createNewSampingEventForUser(eventName, username) {
	return dispatch => {
		let eventID = dispatch(createNewSamplingEvent(eventName));
		dispatch({ type: REGISTER_EVENT_WITH_USERNAME, eventID, username });
		return eventID;
	}
}

// function getActionsFromActionString(actionsString) {   // returns array of arrays... action[0][0] is the name of the action, action[0][1...] are the action parameters
// 	let actionsArr = actionsString.split('&');
// 	let actions = actionsArr.map((actionString) => {
// 		return actionString.split('::');
// 	});
// 	return actions;
// }

function getActionsFromActionString(actionsString) {
	let actionsArr = actionsString.split('&');
	let actions = {};
	actionsArr.map((actionString)=> {
		let actionParameters = actionString.split('::');
		let actionName = actionParameters.splice(0,1);
		
		if(typeof actions[actionName] === 'undefined') {
			actions[actionName] = [actionParameters];
		} else {
			actions[actionName].push(actionParameters);
		}
	}
	);
	return actions;
}


function getQuestionFromQuestionID(questionID, store) {
	if (store.Questions.questionsData[questionID])
		return store.Questions.questionsData[questionID]
	else
		return null;
}

function translateActionStringActionNameToAction(actionName) {
	switch (actionName) {
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
			console.warn("Requested action '" + actionName + "' not recognized");
	}
}

function dispatchAllActionsFromActionString(dispatch, actionString) {
	let actionsToDispatch = getActionsFromActionString(actionString);
	console.log(actionsToDispatch);
	Object.keys(actionsToDispatch).forEach((sedFFActionName)=> {
		console.log(sedFFActionName);
		dispatch({ type: translateActionStringActionNameToAction(sedFFActionName), payload: actionsToDispatch[sedFFActionName] });
	});
}