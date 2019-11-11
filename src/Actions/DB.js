import {
	REQUEST_USER_SAMPLING_EVENTS,
	LOAD_COMPLETE_USER_SAMPLING_EVENTS,
	REQUEST_USER_SAMPLING_EVENTS_LIST,
	LOAD_COMPLETE_USER_SAMPLING_EVENTS_LIST,
	REQUEST_SAMPLING_EVENT,
	LOAD_COMPLETE_SAMPLING_EVENT,
	SYNC_ALL_TO_DB
} from '../Constants/ActionTypes';
import { LINK_TABLES } from '../Constants/Config';
import { fetchDBInfo, setDBInfo } from '../Utils/NetworkUtilities';
import { ingestEvent, ingestSamplingEventLinkTable } from './SamplingEvents';
import { userDataIngest } from './User';

export function syncToDB() {
	return { type: SYNC_ALL_TO_DB }
}

function requestUserEvents(username) {
	return {
		type: REQUEST_USER_SAMPLING_EVENTS,
		username
	}
}

function loadCompleteUserEvents(username) {
	return {
		type: LOAD_COMPLETE_USER_SAMPLING_EVENTS,
		username
	}
}

function requestSamplingEventLinkTable(username) {
	return {
		type: REQUEST_USER_SAMPLING_EVENTS_LIST,
		username
	}
}

function loadCompleteSamplingEventLinkTable(username) {
	return {
		type: LOAD_COMPLETE_USER_SAMPLING_EVENTS_LIST,
		username
	}
}

function requestSamplingEvent(eventID) {
	return {
		type: REQUEST_SAMPLING_EVENT,
		eventID
	}
}
function loadCompleteSamplingEvent(eventID) {
	return {
		type: LOAD_COMPLETE_SAMPLING_EVENT,
		eventID
	}
}

function fetchSamplingEventLinkTable(username) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "username", value: username },
				"SamplingEventLinkTable",
				(dbResponse) => {  // success callback
					console.log("fetchSamplingEventLinkTable Success callback");
					if (Array.isArray(dbResponse) && dbResponse.length === 1) {
						resolve(dbResponse[0]);
					} else {
						reject(dbResponse);
					}
				},
				(dbResponse) => { // failure callback
					console.warn("userDataAcquire fetchDBInfo failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	}
}

function fetchSamplingEvent(eventID) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "eventID", value: eventID },
				"SamplingEvents",
				(dbResponse) => {  // success callback
					if (Array.isArray(dbResponse) && dbResponse.length === 1) {
						resolve(dbResponse[0]);
					} else {
						reject(dbResponse);
					}
				},
				(dbResponse) => { // failure callback
					console.warn("fetchSamplingEvent fetchDBInfo failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	}
}



export function loadAllUserEvents(username) {
	return (dispatch, getState) => {
		dispatch(requestUserEvents(username));
		dispatch(requestSamplingEventLinkTable(username));
		dispatch(fetchSamplingEventLinkTable(username))
			.then((samplingEventLinkTable) => {
				dispatch(ingestSamplingEventLinkTable(samplingEventLinkTable, username))
					.then(listIngestSuccess => {
						dispatch(loadCompleteSamplingEventLinkTable(username))
						samplingEventLinkTable.events.forEach((eventID) => {
							dispatch(requestSamplingEvent(eventID));
							dispatch(fetchSamplingEvent(eventID))
								.then((event) => {
									dispatch(ingestEvent(event))
										.then(eventID => dispatch(loadCompleteSamplingEvent(eventID)))
										.catch(eventIngestFailure => console.warn(eventID + " failed to ingest: " + eventIngestFailure));
								})
								.catch(eventFetchFailure => console.warn(eventID + " was in link table but not found cleanly in the database: " + eventFetchFailure)); //TODO: notify, upload? or cleanup table ... this event wasn't found in DB
						});
					})
					.catch(listIngestFailure => console.warn('failed to ingest samplingEventLinkTable: ' + listIngestFailure));
			})
			.then(dispatch(loadCompleteUserEvents(username)))
			.catch((samplingEventLinkTableFetchFailure) => {
				console.log('CATCH samplingEventLinkTableResponse :', samplingEventLinkTableFetchFailure);
			});
	};
}



export function userDataAcquire(username) {
	console.log("userDataAcquire(", username, ")");
	// check if username is in store
	// if not, check from database
	// if not, reject with false
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			const user = getState().Users[username];
			if (user) {
				console.log("User exists in memory");
				//TODO: check if one in DB is newer...
				resolve(true);
			} else {
				fetchDBInfo({ key: "username", value: username },
					"Users",
					(dbResponse) => {  // success callback
						console.log("Success callback");
						if (Array.isArray(dbResponse) && dbResponse.length === 1) {
							let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
							console.log('dispatchResp', dispatchResp)
							resolve(true);
						} else {
							console.log("dbResponse did not return exactly one user");
							reject(false);
						}
					},
					(res) => { // failure callback
						console.warn("userDataAcquire fetchDBInfo failure callback: " + res);
						reject(false);
					});

				// fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
				// 	.then(response => response.json())
				// 	.then(json => dispatch(userDataIngest(json)))
				// 	.then((didIngest) => {
				// 		if (didIngest) {
				// 			resolve(true);
				// 		} else {
				// 			reject(false);
				// 		}
				// 	});
			}
		})
	}
}

export function linkTablePush(tableType, username, userTable, successCB, failureCB) {
	console.log("linkTablePush(", tableType, username, userTable, ")");
	if (!Object.keys(LINK_TABLES).includes(tableType)) {
		throw new Error("Attempting to push an invalid table type: ", tableType);
	}

	// return (dispatch, getState) => {
	setDBInfo({ key: "username", value: username },
		LINK_TABLES[tableType],
		userTable,
		(dbResponse) => {  // success callback
			console.log("linkTablePush Success callback: ", dbResponse);
			successCB(dbResponse)
			// if (Array.isArray(dbResponse) && dbResponse.length === 1) {
			// 	let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
			// 	console.log('dispatchResp', dispatchResp)
			// resolve(true);
			// } else {
			// 	console.log("dbResponse did not return exactly one user");
			// 	reject(false);
			// }
		},
		(dbResponse) => { // failure callback
			console.warn("linkTablePush Failure callback: " + dbResponse);
			failureCB(dbResponse);
			// reject(false);
		});
	// }
}
export function eventPush(username, event, successCB, failureCB) {
	console.log("eventPush(", username, event, ")");
	//TODO: validate that the event is formed correctly...

	// return (dispatch, getState) => {
	setDBInfo({ key: "eventID", value: event.eventID },
		"SamplingEvents",
		event,
		(dbResponse) => {  // success callback
			console.log("eventPush Success callback: ", dbResponse);
			successCB(dbResponse)
			// if (Array.isArray(dbResponse) && dbResponse.length === 1) {
			// 	let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
			// 	console.log('dispatchResp', dispatchResp)
			// resolve(true);
			// } else {
			// 	console.log("dbResponse did not return exactly one user");
			// 	reject(false);
			// }
		},
		(dbResponse) => { // failure callback
			console.warn("eventPush Failure callback: " + dbResponse);
			failureCB(dbResponse);
			// reject(false);
		});
	// }
}
