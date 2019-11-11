import {
	REGISTER_EVENT_WITH_USERNAME,
	REGISTER_STATION_WITH_USERNAME,
	REMOVE_STATION_FROM_USERNAME,
	RECIEVE_LINK_TABLE,
	REQUEST_LINK_TABLE,
	INVALIDATE_LINK_TABLE,
	SET_SAMPLING_EVENT_LINK_TABLE
} from '../Constants/ActionTypes';
import { LINK_TABLES } from '../Constants/Config';

import _ from 'lodash';

const initialEventLinkTableState = {
	"SamplingEventLinkTable": {
		'jfederer@usgs.gov': [
			'695833f2-e483-4c34-a962-d14f79037920',
			'dd8c3689-d8a8-42ef-bf9f-a52a52f611b8',
			'2a22be8e-aa07-41ef-81b2-6b09f8752075',
			'9076d701-8303-4bb9-8265-630980811838'
		],
		"test@usgs.gov": ["475c42c6-8642-4d0c-a98a-36d5374f00f4", "695833f2-e483-4c34-a962-d14f79037920"]
	},
	"StationLinkTable": {
		"jfederer@usgs.gov": ["0c4ef4d8-6041-414b-9456-f8f2dd6c2575", "d4e95192-00a4-4ef7-baa1-7827f50c7c67" ]
	}
};

export function LinkTables(state = initialEventLinkTableState, action) {
	let newState = _.cloneDeep(state);
	console.log('newState :', newState);
	switch (action.type) {
		case REGISTER_EVENT_WITH_USERNAME:
			if (!newState.SamplingEventLinkTable[action.username]) {
				newState.SamplingEventLinkTable[action.username] = [];
			}
			newState.SamplingEventLinkTable[action.username].push(action.eventID); // push acceptable on clone  //FIXME: fails if user doesn't exist in list
			return newState;
		case REGISTER_STATION_WITH_USERNAME:
			if (!newState.StationLinkTable[action.username]) {
				newState.StationLinkTable[action.username] = [];
			}
			newState.StationLinkTable[action.username].push(action.stationID); // push acceptable on clone //FIXME: fails if user doesn't exist in list
			return newState;
		case REMOVE_STATION_FROM_USERNAME:
			newState.StationLinkTable[action.username] = newState.StationLinkTable[action.username].filter((linkedStationID) => linkedStationID !== action.stationIDToRemove);
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
		case SET_SAMPLING_EVENT_LINK_TABLE: 
		console.log('action :', action);
		console.log('LINK_TABLES[action.tableType] :', LINK_TABLES[action.tableType]);
			newState[LINK_TABLES[action.tableType]][action.samplingEventLinkTable.username]=action.samplingEventLinkTable;
			return newState;
		default:
			return state
	}
}
