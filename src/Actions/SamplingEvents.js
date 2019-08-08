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
	HIDE_QUESTIONS,
	RUN_ALL_SAMPLE_EVENT_QUESTION_ACTIONS
} from '../Constants/ActionTypes';
import { emptySamplingEvent } from '../Constants/DefaultObjects';
import { getEventFromID, getQuestionsData, getQuestionDataFromID, getStationFromID, getStationIDsFromName } from '../Utils/StoreUtilities';
import { SET_INFORMATION_IDENTIFIER } from '../Constants/Config';
import { getQuestionValue, getMethodCategoryFromValue, getDescriptiveColumnForTable } from '../Utils/QuestionUtilities';
import { showNavigationTab } from './UI';
import { createInitialQWDATAValue, verifyPassedQWDATAValue } from '../Components/Questions/QWDATATable';
import { createInitialParametersTableValue, verifyPassedParametersTableValue} from '../Components/Questions/ParametersTable';



/**
* @desc changes value of a question in a given event to a new value.  Then runs any actions associated with that question ('anyValue' first, then the given value). 
* @param eventID {string} - the unique event ID.
* @param questionID {string} - the question ID.  If this does not exist in the event, the key will be created and given a value in the questionsValues.
* @param newValue {any} - the value to assign to the question
* @returns void
*/
export function SEQuestionValueChange(eventID, questionID, newValue) {  //TODO: add something in for non-Sampling-Events questions (settings, etc)

	console.log("SEQuestionVAlueChange(eventID: ", eventID, "  questionID: ", questionID, "  newValue: ", newValue);

	return (dispatch, getState) => {
		dispatch({ type: SE_QUESTION_VALUE_CHANGE, eventID, questionID, newValue });

		//get question and conditionally the action string
		dispatch(conditionallyRunActionString(eventID, getQuestionDataFromID(questionID))); //TODO: need getState?  Call a store util instead?
	}
}

function conditionallyRunActionString(eventID, question) {
	//console.log("conditionallyRunActionString(", eventID, question, ")");
	

	return (dispatch, getState) => {
		if (question) {
			let value = getQuestionValue(eventID, question.id);
			let actions = question.actions;
			if (actions) {
				// if action string exists...
				let anyValueActionString = actions["anyValue"];
				if (anyValueActionString) {
					// run 'anyValue' action strings first
					dispatchAllActionsFromActionString(dispatch, anyValueActionString);
				}

				let thisValueActionString = actions[value];
				if (thisValueActionString) {
					// run this specific value's action string second
					dispatchAllActionsFromActionString(dispatch, thisValueActionString);
				}
			}
		} else {
			console.warn("Attempted to conditionally run action string on falsey question object");	
		}//TODO: do I need to include somethign if this conditional is false...?
	}
}

export function runAllSamplingEventActionStrings(eventID) { // TODO: recursive to allow sub ID's to have actions
	//console.log("runAllSamplingEventActionStrings(", eventID, ")");

	return (dispatch, getState) => {
		dispatch({type:RUN_ALL_SAMPLE_EVENT_QUESTION_ACTIONS}); // basically just for redux logging purposes - FUTURE: use this to block view changes until complete
		let event = getEventFromID(eventID);
		Object.keys(event.questionsValues).map((key) => {
			try {
				let questionData = getQuestionDataFromID(key);
				if (questionData) {
					dispatch(conditionallyRunActionString(eventID, questionData));
				}
			}
			catch (e) {
				console.warn("Unable to get questionsValues or questionData for event: ", eventID, e.name, e.message);
			}
			return null; //satsify linter
		})
	}
}


/**
* @desc creates a new sampling event from scratch and links it to a given user
* @param {string} eventName  - the event name.  If empty string, will be given date-based name
* @param {string} username  - the user name to link the event to.
* @returns the eventID of the newly created event 
*/
export function createNewSampingEventForUser(eventName, username) {
	if (!username) {
		throw new Error("No username passed to createNewSamplingEventForUser function");
	}

	return dispatch => {
		let eventID = dispatch(createNewSamplingEvent(eventName));
		dispatch({ type: REGISTER_EVENT_WITH_USERNAME, eventID, username });
		return eventID;
	}
}

/**
* @desc syncronus function creates new, blank event based on template
* @param eventName {string} - the new event name.  If empty string, will be given date-based name
* @returns the eventID of the newly created event  (note, up to the reciever to link user and event in eventLinkTable)
*/
export function createNewSamplingEvent(eventName) {
	return dispatch => {
		// get blank event and fill with initial data
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

		newEvent.dateModified = new Date().toString(); //TODO: NEXT: NEXT: NEXT: should be calling eventModified action instead?


		// find all questions with actual default 'values' in questionsData and include those in the new event
		let filtered = _.filter(getQuestionsData(), (QD) =>
			typeof QD.value !== 'undefined' && // undefined gets filtered out
			(QD.value || QD.value === 0 || typeof QD.value === 'boolean') && // truthy value, zero, and booleans make it through filter
			(typeof QD.value !== 'object' || Object.keys(QD).length < 1)
		);
		Object.keys(filtered).map((key) => {
			newEvent['questionsValues'][filtered[key].id] = filtered[key].value;
			return null // safisfy linter
		}
		);

		//OPTIMIZE: call an optional callback 

		dispatch({ type: CREATE_NEW_SAMPLING_EVENT, event: newEvent });
		return (newEvent.eventID);
	}
}



export function stationNameChanged(eventID, newStationName) {
	// remember to make any changes here reflect in addButtonClickHandler for the AddRemoveStationDialog function
	// console.log("stationNameChanged(", eventID,", ", newStationName,")");

	//TODO: verify station is acceptable
	
	//note: displayName is already changed.
	return (dispatch, getState) => {
		let stationID = getStationIDsFromName(getState().SedFF.currentUsername, newStationName)[0];
		let station = getStationFromID(stationID);

		dispatch(SEQuestionValueChange(eventID, "stationNumber", station.number)); //station.number is a required station attribute

		if(station.defaultProjectName) {
			dispatch(SEQuestionValueChange(eventID, "projectName", station.defaultProjectName));
		}
		if(station.defaultProjectID) {
			dispatch(SEQuestionValueChange(eventID, "projectID", station.defaultProjectID));
		}
		if(station.defaultAgencyCode) {
			dispatch(SEQuestionValueChange(eventID, "agencyCode", station.defaultAgencyCode));
		}

	}
}

export function numberOfSamplingPointsChanged(eventID, setName, samplingMethod, numPoints, setInfoChangeHandler) {
	// console.log("numberOfSamplingPointsChanged(", eventID, setName, samplingMethod, numPoints, ")");
	if (numPoints === null || numPoints === "" || isNaN(numPoints)) {
		return { type: 'CANCEL numberOfSamplingPointsChanged due to invalid numPoints passed' };
	}

	return dispatch => {
		dispatch(showNavigationTab("QWDATA"));
		dispatch(showNavigationTab("Parameters"));
		
		////// modify setInfo table //////
		// make it the correct size (confirm with user if shrinking)
		let setInfoSampleTableValue = getQuestionValue(eventID, SET_INFORMATION_IDENTIFIER + setName, "samplesTable_" + getMethodCategoryFromValue(samplingMethod));

		if (typeof setInfoSampleTableValue === 'undefined' || setInfoSampleTableValue === null) {
			// eslint-disable-next-line no-useless-concat
			throw new Error("getQuestionValue(" + eventID + ", " + SET_INFORMATION_IDENTIFIER + setName + ", " + "samplesTable_" + getMethodCategoryFromValue(samplingMethod) + ") returned undefined or null");
		}

		//TODO: Decide when/how to react and/or confirm ... change stationing without notice? delete without notice if empty other than stationing, etc...

		if (setInfoSampleTableValue.length >= parseInt(numPoints)+1) {
			// table must shrink
			// console.log("Table must shrink");

			// if the removed tables are empty... no worries, just do it.
			//TODO:4

			// otherwise, confirm before proceeding...

			let deletionconfirmed = window.confirm("This will result in removing rows containing data from the Data Entry Set Information Data Table, QWDATA table, and Parameters Table... \n\n Do you want to continue?");

			if (deletionconfirmed === true) {
				while (setInfoSampleTableValue.length > numPoints) {
					setInfoSampleTableValue.pop();
				}
			} else {
				alert("Table modifications cancelled! Note that Sampling Points and the table sizes are now out of sync");
				return { type: 'CANCEL numberOfSamplingPointsChanged due to user confirmation failure' };
			}
		}


		if (setInfoSampleTableValue.length <= numPoints) {
			//table must expand
			//TODO: warn stationing could change...
			while (setInfoSampleTableValue.length <= numPoints) {
				let newRow = new Array(setInfoSampleTableValue[0].length).fill("");
				setInfoSampleTableValue.push(newRow);
			}

			setInfoChangeHandler(eventID, "samplesTable_" + getMethodCategoryFromValue(samplingMethod), setInfoSampleTableValue);
		}

		
		// re-do any distance data  if EWI (confirm with user)

		////// modify QWDATA table //////TODO:
		let origQWDATAValue = getQuestionValue(eventID, "QWDATATable");
		let QWDATAValue;
		if(!origQWDATAValue) {
			QWDATAValue = createInitialQWDATAValue(eventID);
		} else {
			QWDATAValue = verifyPassedQWDATAValue(eventID, origQWDATAValue);
		}

		if (!_.isEqual(origQWDATAValue, QWDATAValue)) {
			dispatch(SEQuestionValueChange(eventID, "QWDATATable", QWDATAValue));
		}

		////// modify Parameters table //////TODO:
		let origParameterValue = getQuestionValue(eventID, "parametersTable");
		let parameterValue;
		if(!origParameterValue) {
			parameterValue = createInitialParametersTableValue(eventID);
		} else {
			parameterValue = verifyPassedParametersTableValue(eventID, origParameterValue);
		}

		if (!_.isEqual(origParameterValue, parameterValue)) {
			dispatch(SEQuestionValueChange(eventID, "parametersTable", parameterValue));
		}
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

/** 
@desc dispatches all actions included in the action string.
@param dispatch {function} the redux-thunk dispatch function
@param actionString {string} the sedFF action action string.  it will be split up and translated in order to dispatch.
@returns {void}
*/
function dispatchAllActionsFromActionString(dispatch, actionString) {
	//console.log("dispatchAllActionsFromActionString(", actionString, ")");

	let actionsToDispatch = getActionsFromActionString(actionString);
	Object.keys(actionsToDispatch).forEach((sedFFActionName) => {
		dispatch({ type: translateActionStringActionNameToAction(sedFFActionName), payload: actionsToDispatch[sedFFActionName] });
	});
}