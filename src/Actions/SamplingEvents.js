import _ from 'lodash';
import uuidv4 from 'uuid';

import {
	CREATE_NEW_SAMPLING_EVENT,
	REGISTER_EVENT_WITH_USERNAME,
	SE_QUESTION_VALUE_CHANGE,
	SE_QUESTION_VALUE_DELETE,
	SAMPLING_EVENT_BANK_CHANGE,
	SAMPLING_EVENT_SET,
	SAMPLING_EVENTS_LINK_TABLE_SET,
	REMOVE_EVENT_FROM_USERNAME
} from '../Constants/ActionTypes';

import { emptySamplingEvent } from '../Constants/DefaultObjects';
import { getQuestionsData, getStationFromID, getStationIDsFromName, getEventFromID } from '../Utils/StoreUtilities';
import { getColumnNumberFromTableHeader } from '../Utils/QuestionUtilities';
// import { setDBInfo } from '../Utils/NetworkUtilities';
import {
	SET_INFORMATION_IDENTIFIER,
	IDENTIFIER_SPLITTER,
	DATA_ENTRY_INFORMATION_IDENTIFIER,
	QWDATA_TABLE_IDENTIFIER,
	PARAMETERS_TABLE_IDENTIFIER,
	ACTIONABLE_GLOBAL_QIDS,
	EWI_METHOD_CATEGORY,
	EDI_METHOD_CATEGORY,

} from '../Constants/Config';

import { EVENTS_LINK_TABLE_TYPE } from '../Constants/Dictionary';

import { getQuestionValue, getMethodCategoryFromValue, getSamplesTableValueWithGivenBank, getDataEntryValueWithGivenBank } from '../Utils/QuestionUtilities';
import { provideEWISamplingLocations, provideEDISamplingPercentages } from '../Utils/CalculationUtilities';
import { createInitialQWDATAValue, verifyPassedQWDATAValue } from '../Components/Questions/QWDATATable';
import { createInitialParametersTableValue, verifyPassedParametersTableValue } from '../Components/Questions/ParametersTable';

import { showNavigationTab, updateNavMenu } from './UI';


/**
* @desc changes value of a question in a given event to a new value.  Then runs any actions associated with that question ('anyValue' first, then the given value). 
* @param eventID {string} - the unique event ID.
* @param questionID {string} - the question ID.  If this does not exist in the event, the key will be created and given a value in the questionsValues.
* @param newValue {any} - the value to assign to the question
* @returns void
*/
export function SEQuestionValueChange(eventID, questionID, newValue) {  //TODO: add something in for non-Sampling-Events questions (settings, etc)
	// console.log("SEQuestionValueChange(eventID: ", eventID, "  questionID: ", questionID, "  newValue: ", newValue);

	return (dispatch, getState) => {
		dispatch({ type: SE_QUESTION_VALUE_CHANGE, eventID, questionID, newValue });

		if (ACTIONABLE_GLOBAL_QIDS.includes(questionID)) {
			dispatch(runSpecialQIDAction(eventID, questionID, newValue));
		}
	}
}

function runSpecialQIDAction(eventID, questionID, newValue) {
	// console.log("runSpecialQIDAction(", eventID, questionID, newValue, ")");
	if (!ACTIONABLE_GLOBAL_QIDS.includes(questionID)) {
		return null;
	}

	return (dispatch, getState) => {
		if (questionID.startsWith("samplingMethod_")) {
			//create Data Entry object in values if it doesn't exist... 
			let sedType = questionID.split("samplingMethod_")[1];
			let DE = getQuestionValue(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedType);
			if (typeof DE === "undefined") {
				dispatch(SEQuestionValueChange(eventID, DATA_ENTRY_INFORMATION_IDENTIFIER + sedType, {}));
			}
			if (eventID === getState().SedFF.currentSamplingEventID) {
				dispatch(updateNavMenu());
			}
		}


		// if (questionID.startsWith("waterwayInfo") || questionID.startsWith("bank")) {
		if (questionID.startsWith("waterwayInfo")) {
			//TODO: check if values exist in stationing, piers, etc... if so, warn before dispatching

			// check if bank has changed from current...
			dispatch(samplingEventBankChange(eventID, newValue.bank));
		}

		if (questionID === "collectingAgency") {
			//action showQuestion / hideQuestion depending on question.value
		}
	}
}


export function samplingEventBankChange(eventID, bank) {
	// console.log("samplingEventBankChanged(", bank, ")");
	return (dispatch, getState) => {
		dispatch({ type: SAMPLING_EVENT_BANK_CHANGE, eventID, bank }); // this is often redundant because the SEQuestionVAlueChange would happen first in most flow paths
		// change all samples_tables in values
		let event = getEventFromID(eventID);
		Object.keys(event.questionsValues).forEach((QID) => {
			if (!QID.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER)) {
				return;
			}
			let newDEValue = getDataEntryValueWithGivenBank(event.questionsValues[QID], bank);

			dispatch(SEQuestionValueChange(eventID, QID, newDEValue));
		})
	}
}


/**
* @desc removed/deletes value of a question in a given event.
* @param eventID {string} - the unique event ID.
* @param questionID {string} - the question ID. 
* @returns void
*/
export function SEQuestionValueDelete(eventID, questionID) {
	return (dispatch) => {
		dispatch({ type: SE_QUESTION_VALUE_DELETE, eventID, questionID, });
	}
}


/**
* @desc creates a new sampling event from scratch and links it to a given user
* @param {string} eventName  - the event name.  If empty string, will be given date-based name
* @param {string} username  - the user name to link the event to.
* @returns the eventID of the newly created event 
*/
export function createNewSampingEventForUser(eventName, username, eventTemplate) {
	if (!username) {
		throw new Error("No username passed to createNewSamplingEventForUser function");
	}

	return dispatch => {
		let eventID = dispatch(createNewSamplingEvent(eventName, eventTemplate));
		dispatch({ type: REGISTER_EVENT_WITH_USERNAME, eventID, username });
		return eventID;
	}
}

/**
* @desc syncronus function creates new, blank event based on template
* @param eventName {string} - the new event name.  If empty string, will be given date-based name
* @returns the eventID of the newly created event  (note, up to the reciever to link user and event in eventLinkTable)
*/
export function createNewSamplingEvent(eventName, eventTemplate) {
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
		let GQD = getQuestionsData(null); 
		let filtered = _.filter(GQD, (QD) => {//TODO: could we use newEvent.eventID
			if (typeof QD.value === 'undefined') { // undefined gets filtered out
				return false;
			}

			if (QD.id === "waterwayInfo") {  // had to separate, because we want this value to copy... but other objects without default values not to.
				return true;
			}

			if (typeof QD.value === 'object' || Object.keys(QD).length < 1) {
				return false;
			}

			if (QD.value || QD.value === 0 || typeof QD.value === 'boolean') { // truthy value or zero, and booleans make it through filter
				return true;
			}


			return false;
		}
		);

		Object.keys(filtered).forEach((key) => {  //this is already an array.... TODO: just move this to a normal forEach... not doing it before demo
			newEvent['questionsValues'][filtered[key].id] = filtered[key].value;
		}
		);


		// optionally add template questions data and values
		if (eventTemplate) {
			newEvent.questionsData = _.cloneDeep(eventTemplate.questionsData);

			Object.keys(eventTemplate.questionValues).forEach(key => {
				newEvent.questionsValues[key] = eventTemplate.questionValues[key];
			})
		}


		//OPTIMIZE: call an optional callback 

		dispatch({ type: CREATE_NEW_SAMPLING_EVENT, event: newEvent });
		return (newEvent.eventID);
	}
}


export function ingestEvent(event) {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			//FIXME: TODO: check for format & age
			dispatch({
				type: SAMPLING_EVENT_SET,
				event
			});
			resolve(event.eventID);
		});
	}
}

export function ingestSamplingEventsLinkTable(samplingEventsLinkTable) {

	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			//FIXME: TODO: check for format & age
			dispatch({
				type: SAMPLING_EVENTS_LINK_TABLE_SET,
				samplingEventsLinkTable
			});
			resolve();
		});
	}
}

export function removeEventFromUsername(eventIDToRemove, username) {
	return { 
		type: REMOVE_EVENT_FROM_USERNAME,
		eventIDToRemove,
		username
	}
}

export function stationNameChanged(eventID, newStationName) {
	// remember to make any changes here reflect in addButtonClickHandler for the AddRemoveStationDialog function

	//TODO: verify station is acceptable

	//note: displayName is already changed at this point.
	return (dispatch, getState) => {
		let stationIDs = getStationIDsFromName(getState().SedFF.currentUsername, newStationName);
		if (!Array.isArray(stationIDs) || !stationIDs.length) {
			return null;
		}
		let stationID = stationIDs[0];

		let station = getStationFromID(stationID);


		dispatch(SEQuestionValueChange(eventID, "stationNumber", station.number)); //station.number is a required station attribute

		if (station.defaultProjectName) {
			dispatch(SEQuestionValueChange(eventID, "projectName", station.defaultProjectName));
		}
		if (station.defaultProjectID) {
			dispatch(SEQuestionValueChange(eventID, "projectID", station.defaultProjectID));
		}
		if (station.defaultAgencyCode) {
			dispatch(SEQuestionValueChange(eventID, "agencyCode", station.defaultAgencyCode));
		}
		if (station.defaultBank) {
			//TODO: throw warning if bridge wizard or stationinghas been filled out
			let WWIValue = _.cloneDeep(getQuestionValue(eventID, "waterwayInfo"));
			WWIValue.bank = station.defaultBank;
			dispatch(SEQuestionValueChange(eventID, "waterwayInfo", WWIValue));
		}

	}
}

export function numberOfSamplingPointsChanged(eventID, sedimentType, setName, samplingMethod, numPoints, setInfoChangeHandler) {
	//  console.log("numberOfSamplingPointsChanged(", eventID, sedimentType, setName, samplingMethod, numPoints, ")");
	if (numPoints === null || numPoints === "" || parseInt(numPoints) === 0 || isNaN(numPoints)) {
		return { type: 'CANCEL numberOfSamplingPointsChanged due to invalid numPoints passed' };
	}



	return dispatch => {
		dispatch(showNavigationTab("QWDATA"));   //TODO: change this to the nav tab calculator?
		dispatch(showNavigationTab("Parameters"));

		////// modify setInfo table //////
		// make it the correct size (confirm with user if shrinking)
		let setInfoSampleTableValue =
			getQuestionValue(eventID,
				DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType,
				DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER + setName,
				"samplesTable_" + getMethodCategoryFromValue(samplingMethod) + "_" + sedimentType);

		if (typeof setInfoSampleTableValue === 'undefined' || setInfoSampleTableValue === null) {
			// eslint-disable-next-line no-useless-concat
			let errMSG = "getQuestionValue(" + eventID + ", " + DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + ", " + DATA_ENTRY_INFORMATION_IDENTIFIER + sedimentType + IDENTIFIER_SPLITTER + SET_INFORMATION_IDENTIFIER + setName + ", " + "samplesTable_" + getMethodCategoryFromValue(samplingMethod) + "_" + sedimentType + ") returned ";
			errMSG += setInfoSampleTableValue === null ? "null" : "undefined";
			throw new Error(errMSG);
		}

		//TODO: Decide when/how to react and/or confirm ... change stationing without notice? delete without notice if empty other than stationing, etc...



		if (setInfoSampleTableValue.length > parseInt(numPoints) + 1) {

			// table must shrink
			// console.log("Table must shrink");

			//TODO: // if the removed tables are empty... no worries, just do it.

			// otherwise, confirm before proceeding...

			let deletionconfirmed = window.confirm("This will result in removing rows containing data from the Data Entry Set Information Data Table, QWDATA table, and Parameters Table... \n\n Do you want to continue?");

			if (deletionconfirmed === true) {
				while (setInfoSampleTableValue.length > parseInt(numPoints) + 1) {
					setInfoSampleTableValue.pop();
				}
			} else {
				alert("Table modifications cancelled! Note that Sampling Points and the table sizes are now out of sync");
				return { type: 'CANCEL numberOfSamplingPointsChanged due to user confirmation failure' };
			}
		}


		if (setInfoSampleTableValue.length < parseInt(numPoints) + 1) {
			//table must expand
			//TODO: warn stationing could change...
			while (setInfoSampleTableValue.length < parseInt(numPoints) + 1) {
				let newRow = new Array(setInfoSampleTableValue[0].length).fill("");
				setInfoSampleTableValue.push(newRow);
			}
		}

		//setInfoSampleTableValue is now appropriate size...

		//verify the table value is coming from the correct bank...\
		let fromBank = getEventFromID(eventID).questionsValues.waterwayInfo.bank;  //TODO: getquestionvalue instead of direct connection
		console.assert(fromBank, "From bank is " + typeof fromBank);
		setInfoSampleTableValue = getSamplesTableValueWithGivenBank(setInfoSampleTableValue, fromBank);

		// re-do any distance data (confirm with user) //TODO:
		switch (getMethodCategoryFromValue(samplingMethod)) {
			case EWI_METHOD_CATEGORY:
				let WWQV = getQuestionValue(eventID, "waterwayInfo");
				let ESZ_Start = WWQV["edgeOfSamplingZone_Start"];  //TODO: change to "Starting" and "Ending" rather than "left and "right"?
				let ESZ_End = WWQV["edgeOfSamplingZone_End"]

				let pierStartLocations = [];
				let pierWidths = [];
				WWQV.piers.forEach(pierData => {
					pierStartLocations.push(pierData.start);
					pierWidths.push(pierData.end - pierData.start);
				})

				let samplingLocations = provideEWISamplingLocations(ESZ_Start, ESZ_End, pierStartLocations, pierWidths, numPoints);
				let distanceColumn = getColumnNumberFromTableHeader(setInfoSampleTableValue, "Distance from ");

				//insert distances into setInfoSampleTableValue   //TODO: instead of column zero, do the appropriate search for header
				samplingLocations.forEach((dist, i) => setInfoSampleTableValue[i + 1][distanceColumn] = dist);
				break;
			case EDI_METHOD_CATEGORY:
				let samplingPercentages = provideEDISamplingPercentages(numPoints);
				samplingPercentages.forEach((percent, i) => setInfoSampleTableValue[i + 1][0] = percent);
				break;
			default:
			// do nothing, this is an 'other' category
		}



		// 'save' the modified table...
		setInfoChangeHandler(eventID, "samplesTable_" + getMethodCategoryFromValue(samplingMethod) + "_" + sedimentType, setInfoSampleTableValue);  //TODO: underscore should be something defined in config







		// let samplingLocations = provideEWISamplingLocations(

		// 	,


		// 	)
		// case EDI_METHOD_CATEGORY:








		////// modify QWDATA table //////TODO:
		let origQWDATAValue = getQuestionValue(eventID, QWDATA_TABLE_IDENTIFIER + sedimentType);
		let QWDATAValue;
		if (!origQWDATAValue) {
			QWDATAValue = createInitialQWDATAValue(eventID, sedimentType);
		} else {
			QWDATAValue = verifyPassedQWDATAValue(eventID, sedimentType, origQWDATAValue);
		}

		if (!_.isEqual(origQWDATAValue, QWDATAValue)) {
			dispatch(SEQuestionValueChange(eventID, QWDATA_TABLE_IDENTIFIER + sedimentType, QWDATAValue));
		}

		////// modify Parameters table //////TODO:
		let origParameterValue = getQuestionValue(eventID, PARAMETERS_TABLE_IDENTIFIER + sedimentType);
		let parameterValue;
		if (!origParameterValue) {
			parameterValue = createInitialParametersTableValue(eventID, sedimentType);
		} else {
			parameterValue = verifyPassedParametersTableValue(eventID, origParameterValue, sedimentType);
		}

		if (!_.isEqual(origParameterValue, parameterValue)) {
			dispatch(SEQuestionValueChange(eventID, PARAMETERS_TABLE_IDENTIFIER + sedimentType, parameterValue));
		}
	}
}



// export function loadUserEventsFromDB(username) {
// 	return function(dispatch) {
// 		// First dispatch: the app state is updated to inform
// 		// that the API call is starting.
// 			dispatch(requestUserEvents(username));

// 		// The function called by the thunk middleware can return a value,
// 		// that is passed on as the return value of the dispatch method.

// 		// In this case, we return a promise to wait for.
// 		// This is not required by thunk middleware, but it is convenient for us.

// 		return fetch(`https://www.reddit.com/r/${subreddit}.json`)
// 		  .then(
// 			response => response.json(),
// 			// Do not use catch, because that will also catch
// 			// any errors in the dispatch and resulting render,
// 			// causing a loop of 'Unexpected batch number' errors.
// 			// https://github.com/facebook/react/issues/6895
// 			error => console.log('An error occurred.', error)
// 		  )
// 		  .then(json =>
// 			// We can dispatch many times!
// 			// Here, we update the app state with the results of the API call.

// 			dispatch(receivePosts(subreddit, json))
// 		  )
// 	  }
// }

// export function saveEventToDB(event) {
// 	let eventID = event.id;
// 	setDBInfo({ key: "eventID", value: eventID },
// 		"Events",
// 		event,
// 		(res) => alert("TEST SUCCESS! " + JSON.stringify(res)),
// 		(res) => alert("TEST FAILURE" + res));
// }


//does not work
// export function getEventFromDB(eventID) {
// 	console.log("getEventFromDB(", eventID, ")");
// 	// check if username is in store
// 	// if not, check from database
// 	// if not, reject with false
// 	return (dispatch, getState) => {
// 		return new Promise(function (resolve, reject) {
// 				fetchDBInfo({ key: "eventID", value: eventID },
// 					"Events",
// 					(dbResponse) => {  // success callback
// 						if (Array.isArray(dbResponse) && dbResponse.length === 1) {
// 							let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
// 							resolve(true);
// 						} else {
// 							console.log("dbResponse did not return exactly one user");
// 							reject(false);
// 						}
// 					},
// 					(res) => { // failure callback
// 						console.warn("userDataAcquire fetchDBInfo failure callback: " + res);
// 						reject(false);
// 					});
// 		})
// 	}
// }




// function getActionsFromActionString(actionsString) {
// 	/* 
// 	@desc splits an action string up in to constituent parts.  Combines all like-actions.
// 	@param actionString {string} - string with actions delimited by ampersand (&) and actions split from action parameters by double-colon (::)
// 	@returns actions {object}, where action[actionName] is an array of arrays of that action's parametes.
// 	*/

// 	let actionsArr = actionsString.split('&');
// 	let actions = {};
// 	actionsArr.map((actionString) => {
// 		let actionParameters = actionString.split('::');
// 		let actionName = actionParameters.splice(0, 1);

// 		if (typeof actions[actionName] === 'undefined') {
// 			actions[actionName] = [actionParameters];
// 		} else {
// 			actions[actionName].push(actionParameters);
// 		}
// 		return null;
// 	}
// 	);
// 	return actions;
// }



// function translateActionStringActionNameToAction(sedFFActionName) {
// 	/* 
// 	@desc translates between SedFF action names and redux action names. //FUTURE: switch sedFF action names to match redux action names?
// 	@param sedFFActionName {string} the sedFF action name... found in 'actions' object as a part of each question object
// 	@returns redux-equivalent action {string}.  If non found, warns and returns null.
// 	*/
// 	switch (sedFFActionName) {
// 		case "ShowTab":
// 			return SHOW_NAVIGATION_TABS;
// 		case "HideTab":
// 			return HIDE_NAVIGATION_TABS;
// 		case "ShowQuestion":
// 			return SHOW_QUESTIONS
// 		case "HideQuestion":
// 			return HIDE_QUESTIONS;
// 		case "ShowPanel":
// 			return SHOW_PANELS;
// 		case "HidePanel":
// 			return HIDE_PANELS;
// 		// case "SetValue":
// 		// 	// let qid = splitActionString[1].split(":")[0];
// 		// 	// let val = splitActionString[1].split(":")[1];
// 		// 	// this.setQuestionValue(qid, val, () => console.log("Set Value!"));
// 		// 	console.log("SET VALUE: TODO"); //TODO:
// 		// 	break;
// 		default:
// 			console.warn("Requested action '" + sedFFActionName + "' not recognized");
// 			return null;
// 	}
// }

// /** 
// @desc dispatches all actions included in the action string.
// @param dispatch {function} the redux-thunk dispatch function
// @param actionString {string} the sedFF action action string.  it will be split up and translated in order to dispatch.
// @returns {void}
// */
// function dispatchAllActionsFromActionString(dispatch, actionString) {
// 	//console.log("dispatchAllActionsFromActionString(", actionString, ")");

// 	let actionsToDispatch = getActionsFromActionString(actionString);
// 	Object.keys(actionsToDispatch).forEach((sedFFActionName) => {
// 		dispatch({ type: translateActionStringActionNameToAction(sedFFActionName), payload: actionsToDispatch[sedFFActionName] });
// 	});
// }