import {
	USER_SAMPLING_EVENTS_REQUEST,
	USER_SAMPLING_EVENTS_LOAD_COMPLETE,

	USER_SAMPLING_EVENTS_LIST_REQUEST,
	USER_SAMPLING_EVENTS_LIST_LOAD_COMPLETE,

	USER_STATIONS_REQUEST,
	USER_STATIONS_LOAD_COMPLETE,

	USER_STATIONS_LIST_REQUEST,
	USER_STATIONS_LIST_LOAD_COMPLETE,

	SAMPLING_EVENT_REQUEST,
	SAMPLING_EVENT_LOAD_COMPLETE,

	STATION_REQUEST,
	STATION_LOAD_COMPLETE,

	SAMPLING_EVENT_PUSH,
	SAMPLING_EVENT_PUSH_COMPLETE,

	SAMPLING_EVENTS_LINK_TABLE_PUSH,
	SAMPLING_EVENTS_LINK_TABLE_PUSH_COMPLETE,

	STATION_PUSH,
	STATION_PUSH_COMPLETE,

	STATIONS_LINK_TABLE_PUSH,
	STATIONS_LINK_TABLE_PUSH_COMPLETE,

	SYNC_ALL_TO_DB
} from '../Constants/ActionTypes';
import {
	LINK_TABLES,
	SAMPLING_EVENTS_LINK_TABLE_COLLECTION_NAME,
	STATIONS_LINK_TABLE_COLLECTION_NAME,
	USERS_COLLECTION_NAME,
	SAMPLING_EVENTS_COLLECTION_NAME,
	STATIONS_COLLECTION_NAME
} from '../Constants/Config';
import { EVENTS_LINK_TABLE_TYPE, STATIONS_LINK_TABLE_TYPE } from '../Constants/Dictionary';
import { fetchDBInfo, setDBInfo } from '../Utils/NetworkUtilities';
import { ingestEvent, ingestSamplingEventsLinkTable } from './SamplingEvents';
import { ingestStation, ingestStationsLinkTable } from './Stations';
import { userDataIngest } from './User';
import { getSamplingEventsLinkTable, getStationsLinkTable } from '../Utils/StoreUtilities';


export function syncToDB() {
	return { type: SYNC_ALL_TO_DB }
}


////////////////////////////////////////////////////////////////
///////////////////// PROMISE FUNCTIONS ////////////////////////
////////////////////////////////////////////////////////////////
function fetchSamplingEventsLinkTable(username) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "username", value: username },
				SAMPLING_EVENTS_LINK_TABLE_COLLECTION_NAME,
				(dbResponse) => {  // success callback
					console.log("fetchSamplingEventsLinkTable Success callback");
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
function fetchStationsLinkTable(username) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "username", value: username },
				STATIONS_LINK_TABLE_COLLECTION_NAME,
				(dbResponse) => {  // success callback
					if (Array.isArray(dbResponse) && dbResponse.length === 1) {
						resolve(dbResponse[0]);
					} else {
						reject(dbResponse);
					}
				},
				(dbResponse) => { // failure callback
					console.warn("fetchStationsLinkTable failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	}
}

function fetchSamplingEvent(eventID) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "eventID", value: eventID },
				SAMPLING_EVENTS_COLLECTION_NAME,
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
function fetchStation(stationID) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			fetchDBInfo({ key: "stationID", value: stationID },
				STATIONS_COLLECTION_NAME,
				(dbResponse) => {  // success callback
					if (Array.isArray(dbResponse) && dbResponse.length === 1) {
						resolve(dbResponse[0]);
					} else {
						reject(dbResponse);
					}
				},
				(dbResponse) => { // failure callback
					console.warn("fetchStation failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	}
}


////////////////////////////////////////////////////////////////
////////////////////// PULL FUNCTIONS //////////////////////////
////////////////////////////////////////////////////////////////
export function loadAllUserEventsFromDB(username) {
	console.log('loadAllUserEventsFromDB(', username, ")");
	return (dispatch, getState) => {
		dispatch(requestUserEvents(username));
		dispatch(requestSamplingEventsLinkTable(username));
		dispatch(fetchSamplingEventsLinkTable(username))
			.then((samplingEventsLinkTable) => {
				dispatch(ingestSamplingEventsLinkTable(samplingEventsLinkTable, username))
					.then(listIngestSuccess => {
						dispatch(loadCompleteSamplingEventsLinkTable(username))
						samplingEventsLinkTable.events.forEach((eventID) => {
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
					.catch(listIngestFailure => console.warn('failed to ingest samplingEventsLinkTable: ' + listIngestFailure));
			})
			.then(dispatch(loadCompleteUserEvents(username)))
			.catch((samplingEventsLinkTableFetchFailure) => {
				console.log('CATCH samplingEventsLinkTableResponse :', samplingEventsLinkTableFetchFailure);
			});
	};
}
export function loadAllUserStationsFromDB(username) {
	return (dispatch, getState) => {
		dispatch(requestUserStations(username));
		dispatch(requestStationsLinkTable(username));
		dispatch(fetchStationsLinkTable(username))
			.then((stationsLinkTable) => {
				dispatch(ingestStationsLinkTable(stationsLinkTable, username))
					.then(listIngestSuccess => {
						dispatch(loadCompleteStationsLinkTable(username))
						stationsLinkTable.stations.forEach((stationID) => {
							dispatch(requestStation(stationID));
							dispatch(fetchStation(stationID))
								.then((station) => {
									dispatch(ingestStation(station))
										.then(stationID => dispatch(loadCompleteStation(stationID)))
										.catch(stationIngestFailure => console.warn(stationID + " failed to ingest: " + stationIngestFailure));
								})
								.catch(stationFetchFailure => console.warn(stationID + " was in link table but not found cleanly in the database: " + stationFetchFailure)); //TODO: notify, upload? or cleanup table ... this event wasn't found in DB
						});
					})
					.catch(listIngestFailure => console.warn('failed to ingest stationsLinkTable: ' + listIngestFailure));
			})
			.then(dispatch(loadCompleteUserStations(username)))
			.catch((stationsLinkTableFetchFailure) => {
				console.log('CATCH stationsLinkTableResponse :', stationsLinkTableFetchFailure);
			});
	};
}

////////////////////////////////////////////////////////////////
////////////////////// PUSH FUNCTIONS //////////////////////////
////////////////////////////////////////////////////////////////
export function pushEventToDB(event) {  //TODO: check with DB version for being newer
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			if (!event) reject("pushEventToDB requires an event object: " + event); //TODO: further verify event format
			dispatch(samplingEventPushToDB(event.eventID));
			setDBInfo({ key: "eventID", value: event.eventID },
				SAMPLING_EVENTS_COLLECTION_NAME,
				event,
				(dbResponse) => {  // success callback
					dispatch(samplingEventPushComplete(event.eventID));
					resolve(dbResponse);
				},
				(dbResponse) => { // failure callback
					console.warn("pushEventToDB setDBInfo failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	};
}
export function pushStationToDB(station) {  //TODO: check with DB version for being newer
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			if (!station) reject("pushStationToDB requires a station object: " + station); //TODO: verify station format
			dispatch(stationPushToDB(station.stationID));
			setDBInfo({ key: "stationID", value: station.stationID },
				STATIONS_COLLECTION_NAME,
				station,
				(dbResponse) => {  // success callback
					dispatch(stationPushComplete(station.stationID));
					resolve(dbResponse);
				},
				(dbResponse) => { // failure callback
					console.warn("pushEventToDB setDBInfo failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	};
}
export function pushLinkTableToDB(tableType, username) {  //TODO: check with DB version for being newer
	// console.log('pushLinkTableToDB(', tableType, username, ")");
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			if (!tableType) reject("pushLinkTableToDB requires a tableType: " + tableType);
			if (!username) reject("pushLinkTableToDB requires an username: " + username);

			let table;
			switch (tableType) {
				case EVENTS_LINK_TABLE_TYPE:
					table = getSamplingEventsLinkTable(username);
					if (typeof table === 'undefined') reject("pushLinkTableToDB unable to find SamplingEventsLinkTable for " + username);
					dispatch(samplingEventsLinkTablePushToDB(table));
					break;
				case STATIONS_LINK_TABLE_TYPE:
					table = getStationsLinkTable(username);
					if (typeof table === 'undefined') reject("pushLinkTableToDB unable to find StationLinkTable for " + username);
					dispatch(stationsLinkTablePushToDB(table));
					break;
				default: reject("Attempting to push an invalid table type: ", tableType);

			}

			setDBInfo({ key: "username", value: username },
				LINK_TABLES[tableType],
				table,
				(dbResponse) => {  // success callback
					switch (tableType) {
						case EVENTS_LINK_TABLE_TYPE:
							dispatch(samplingEventsLinkTablePushComplete(dbResponse));
							break;
						case STATIONS_LINK_TABLE_TYPE:
							dispatch(stationsLinkTablePushComplete(dbResponse));
							break;
					}
					resolve(dbResponse);
				},
				(dbResponse) => { // failure callback
					switch (tableType) {
						case EVENTS_LINK_TABLE_TYPE:
							dispatch(samplingEventsLinkTablePushComplete(dbResponse));
							break;
						case STATIONS_LINK_TABLE_TYPE:
							dispatch(stationsLinkTablePushComplete(dbResponse));
							break;
					}
					console.warn("pushLinkTableToDB setDBInfo failure callback: " + dbResponse);
					reject(dbResponse);
				});
		});
	};
}






////////////////////////////////////////////////////////////////
//////////////////// SYNCRNOUS FUNCTIONS ///////////////////////
////////////////////////////////////////////////////////////////
function stationPushToDB(stationID) {
	return {
		type: STATION_PUSH,
		stationID
	}
}

function stationPushComplete(stationID) {
	return {
		type: STATION_PUSH_COMPLETE,
		stationID
	}
}

function samplingEventPushToDB(eventID) {
	return {
		type: SAMPLING_EVENT_PUSH,
		eventID
	}
}

function samplingEventPushComplete(eventID) {
	return {
		type: SAMPLING_EVENT_PUSH_COMPLETE,
		eventID
	}
}
function samplingEventsLinkTablePushToDB(table) {  //TODO: into reducer
	return {
		type: SAMPLING_EVENTS_LINK_TABLE_PUSH,
		table
	}
}

function samplingEventsLinkTablePushComplete(response) { //TODO: into reducer
	return {
		type: SAMPLING_EVENTS_LINK_TABLE_PUSH_COMPLETE,
		response
	}
}
function stationsLinkTablePushToDB(table) { //TODO: into reducer
	return {
		type: STATIONS_LINK_TABLE_PUSH,
		table
	}
}

function stationsLinkTablePushComplete(response) { //TODO: into reducer
	return {
		type: STATIONS_LINK_TABLE_PUSH_COMPLETE,
		response
	}
}

function requestUserEvents(username) {
	return {
		type: USER_SAMPLING_EVENTS_REQUEST,
		username
	}
}
function requestUserStations(username) {
	return {
		type: USER_STATIONS_REQUEST,
		username
	}
}

function loadCompleteUserEvents(username) {
	return {
		type: USER_SAMPLING_EVENTS_LOAD_COMPLETE,
		username
	}
}
function loadCompleteUserStations(username) {
	return {
		type: USER_STATIONS_LOAD_COMPLETE,
		username
	}
}

function requestSamplingEventsLinkTable(username) {
	return {
		type: USER_SAMPLING_EVENTS_LIST_REQUEST,
		username
	}
}
function requestStationsLinkTable(username) {
	return {
		type: USER_STATIONS_LIST_REQUEST,
		username
	}
}

function loadCompleteSamplingEventsLinkTable(username) {
	return {
		type: USER_SAMPLING_EVENTS_LIST_LOAD_COMPLETE,
		username
	}
}
function loadCompleteStationsLinkTable(username) {
	return {
		type: USER_STATIONS_LIST_LOAD_COMPLETE,
		username
	}
}

function requestSamplingEvent(eventID) {
	return {
		type: SAMPLING_EVENT_REQUEST,
		eventID
	}
}
function loadCompleteSamplingEvent(eventID) {
	return {
		type: SAMPLING_EVENT_LOAD_COMPLETE,
		eventID
	}
}
function requestStation(stationID) {
	return {
		type: STATION_REQUEST,
		stationID
	}
}
function loadCompleteStation(stationID) {
	return {
		type: STATION_LOAD_COMPLETE,
		stationID
	}
}


///////////////////////



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
					USERS_COLLECTION_NAME,
					(dbResponse) => {  // success callback
						if (Array.isArray(dbResponse) && dbResponse.length === 1) {
							let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
							console.log('dispatchResp: ', dispatchResp);
							resolve(true);
						} else {
							console.warn("dbResponse did not return exactly one user");
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

// export function linkTablePush(tableType, username, userTable, successCB, failureCB) {
// 	console.log("linkTablePush(", tableType, username, userTable, ")");
// 	if (!Object.keys(LINK_TABLES).includes(tableType)) {
// 		throw new Error("Attempting to push an invalid table type: ", tableType);
// 	}

// 	// return (dispatch, getState) => {
// 	setDBInfo({ key: "username", value: username },
// 		LINK_TABLES[tableType],
// 		userTable,
// 		(dbResponse) => {  // success callback
// 			console.log("linkTablePush Success callback: ", dbResponse);
// 			successCB(dbResponse)
// 			// if (Array.isArray(dbResponse) && dbResponse.length === 1) {
// 			// 	let dispatchResp = dispatch(userDataIngest(dbResponse[0]));
// 			// 	console.log('dispatchResp', dispatchResp)
// 			// resolve(true);
// 			// } else {
// 			// 	console.log("dbResponse did not return exactly one user");
// 			// 	reject(false);
// 			// }
// 		},
// 		(dbResponse) => { // failure callback
// 			console.warn("linkTablePush Failure callback: " + dbResponse);
// 			failureCB(dbResponse);
// 			// reject(false);
// 		});
// 	// }
// }

// export function eventPush(username, event, successCB, failureCB) {
// 	console.log("eventPush(", username, event, ")");
// 	//TODO: validate that the event is formed correctly...

// 	// return (dispatch, getState) => {

// 	// }
// }
