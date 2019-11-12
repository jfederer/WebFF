import {
	REGISTER_STATION_WITH_USERNAME,
	REMOVE_STATION_FROM_USERNAME,
	STATIONS_LINK_TABLE_SET
} from '../Constants/ActionTypes';

import _ from 'lodash';

const initialState = {
	
};

export function StationsLinkTables(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case REGISTER_STATION_WITH_USERNAME:
			if (!newState[action.username]) {
				newState[action.username] = {username: action.username, stations: []}
			}
			newState[action.username].stations.push(action.stationID); // push acceptable on clone //FIXME: fails if user doesn't exist in list
			return newState;
		case REMOVE_STATION_FROM_USERNAME:
			newState[action.username].stations = newState[action.username].stations.filter((linkedStationID) => linkedStationID !== action.stationIDToRemove);
			//TODO: actually deleting the station, not just the link - optionally looking at the network and other users.
			return newState;
		// case INVALIDATE_LINK_TABLE:
		// 	newState[action.tableName][action.username].didInvalidate = true;
		// 	return newState;
		// case REQUEST_LINK_TABLE: //needs to be called for each table name type
		// 		newState[action.tableName][action.username].didInvalidate = false;
		// 		newState[action.tableName][action.username].isFetching = true;
		// 		return newState;
		// case RECIEVE_LINK_TABLE:  //needs to be called for each table name type
		// 		newState[action.tableName][action.username] = action[action.tableName][action.username];
		// 		newState[action.tableName][action.username].didInvalidate = false
		// 		newState[action.tableName][action.username].isFetching = false;  //TODO: add in some sort of 'updated' date (and/or date modified)
		// 		return newState;
		case STATIONS_LINK_TABLE_SET: 
			newState[action.stationsLinkTable.username]=action.stationsLinkTable;
			return newState;
		default:
			return state
	}
}
