import _ from 'lodash';

import {
	SET_STATION_VALUES,
	REGISTER_STATION_WITH_USERNAME,
} from '../Constants/ActionTypes';

import { emptyUser } from '../Constants/DefaultObjects';


/**
* @desc creates a new station from given data object (via createNewStation), and links it to a given user
* @param {Object} newStationObject -- see createNewStation for full description of this object
* @param {string} username  - the user name to link the event to.
* @returns the eventID of the newly created event 
*/
export function createNewStationForUser(newStationObject, username) {
	if (!username) {
		throw new Error("No username passed to createNewSamplingEventForUser function");
	}

	return dispatch => {
		let stationID = dispatch(createNewSamplingEvent(newStationObject));
		dispatch({ type: REGISTER_STATION_WITH_USERNAME, stationID, username });
		return stationID;
	}
}

/**
* @desc syncronus function creates new, blank event based on template
* @param {Object} newStationObject  - the new station, represented as an object with the following keys (asterisk denotes requied):
*				displayName: "Station Display Name", // if missing, will generate from name
*				*name: "Station full name at whatever river", 
*				*number: "1234",
*				defaultProject: "Default Project",
*				defaultProjectID: "Default ID",
*				defaultAgencyCode: "DefAg"
* @returns the stationID of the newly created station  (note, up to the reciever to link user and station)
*/
export function createNewStation(newStationObject) {
	if (!newStationObject) {
		throw new Error("No Station object sent to createNewStation action");
	}

	if (!newStation.name) { // if no station name given, fail
		throw new Error("No Station name included in new station object sent to createNewStation action", newStationObject);
	}

	if (!newStation.number) { // if no station number given, fail
		throw new Error("No Station number included in new station object sent to createNewStation action", newStationObject);
	}


	return dispatch => {
		let newStation = _.cloneDeep(newStationObject);

		if (!newStation.stationID) {
			newStation.stationID = uuidv4();
		}

		if (!newStation.displayName) {
			newStation.displayName = newStation.name;
		}

		dispatch({ type: SET_STATION_VALUES, station: newStation });
		return (newStation.stationID);
	}
}

