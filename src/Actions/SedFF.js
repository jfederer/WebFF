import {
	SET_CURRENT_USERNAME,
	SET_CURRENT_SAMPLING_EVENT,
	USER_DATA_REQUEST,
	USER_DATA_LOAD_COMPLETE,
	SAMPLING_EVENT_REQUEST,
	SAMPLING_EVENT_LOAD_COMPLETE,
	SET_EVENT_TEMPLATE
} from '../Constants/ActionTypes';

// import { runAllSamplingEventActionStrings } from './SamplingEvents';

import { makeNewUser } from './User';

import { updateNavMenu } from './UI';

import { userDataAcquire } from './DB';

// ****** Terminology ***********
//LOAD = triggered overall event
//REQUEST = SedFF starts the request of the event (invalidates/marks 'isacquireing' etc)
//ACQUIRE = SedFF takes steps to necessary data into memory SYNC... passes to fetch (async) if not in local
//FETCH = SedFF goes to API to get data (async) and passed to ingest
//INGEST = SedFF imports/stores/etc the data that came back from acquire if needed
//LOAD_COMPLETE = UI can release isacquireing and everything is loaded as should be in memory


export function loadAndSetCurrentUser(username) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(userDataRequest(username));


			dispatch(userDataAcquire(username))
				.then(
					() => { // user data acquire resolve
						console.log("then1")
						dispatch(setCurrentUsername(username));
						dispatch(userDataLoadComplete());
						// resolve(username);
					}, () => { // user data acquire reject
						console.log("Unable to acquire user data... making new user.");
						dispatch(makeNewUser(username));
						dispatch(setCurrentUsername(username));
						dispatch(userDataLoadComplete());
						// resolve(username);
						//TODO: modal dialog indicating could overwrite old user data
					}
				).catch(res => console.log("catch: ", res));
		}
		)
	}
}

function userDataRequest(username) {
	return { type: USER_DATA_REQUEST, username };
}

function setCurrentUsername(username) {
	return { type: SET_CURRENT_USERNAME, username }
}

function userDataLoadComplete() {
	return { type: USER_DATA_LOAD_COMPLETE };
}



export function loadAndSetCurrentSamplingEvent(eventID, callback) { // safer way to set sampling event
	return (dispatch) => {
		dispatch(samplingEventRequest(eventID));
		//TODO: verify it's loaded in memory, fetch as needed,
		// (likely uneeded, as we'll never load an event that's not in memory... but just for safety sake)
		dispatch(setCurrentSamplingEvent(eventID))

		// TODO: run ALL values (or at least all actionaly global QIDs ) through SEQuestionValueChange in order to propate all actions...  the above just does the nav items.

		dispatch(updateNavMenu());

		dispatch(samplingEventLoadComplete(eventID));



		// dispatch(runAllSamplingEventActionStrings(eventID));  //TODO: FIXME: will need to replicate this 
		if (callback) {
			callback();
		}
	}
}


function samplingEventRequest(eventID) {
	return { type: SAMPLING_EVENT_REQUEST, eventID: eventID }
}

function setCurrentSamplingEvent(eventID) {
	return { type: SET_CURRENT_SAMPLING_EVENT, eventID: eventID }
}

function samplingEventLoadComplete(eventID) {
	return { type: SAMPLING_EVENT_LOAD_COMPLETE, eventID: eventID }
}

export function setEventTemplate(eventTemplate) {
	return {type: SET_EVENT_TEMPLATE, eventTemplate}
}




