import {
	REGISTER_EVENT_WITH_USERNAME,
	SET_SAMPLING_EVENT_LINK_TABLE
} from '../Constants/ActionTypes';
import { LINK_TABLES } from '../Constants/Config';

import _ from 'lodash';

const initialState = {
	// "SamplingEventLinkTable": {
	// 	'jfederer@usgs.gov': [
	// 		'695833f2-e483-4c34-a962-d14f79037920',
	// 		'dd8c3689-d8a8-42ef-bf9f-a52a52f611b8',
	// 		'2a22be8e-aa07-41ef-81b2-6b09f8752075',
	// 		'9076d701-8303-4bb9-8265-630980811838'
	// 	],
	// 	"test@usgs.gov": ["475c42c6-8642-4d0c-a98a-36d5374f00f4", "695833f2-e483-4c34-a962-d14f79037920"]
	// },
	// "StationLinkTable": {
	// 	"jfederer@usgs.gov": ["0c4ef4d8-6041-414b-9456-f8f2dd6c2575", "d4e95192-00a4-4ef7-baa1-7827f50c7c67" ]
	// }
};

export function SamplingEventsLinkTables(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case REGISTER_EVENT_WITH_USERNAME:
			if (!newState[action.username]) {
				newState[action.username] = {username: action.username, events: []}
			}
			newState[action.username].events.push(action.eventID); // push acceptable on clone  //FIXME: fails if user doesn't exist in list
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
			newState[action.samplingEventLinkTable.username]=action.samplingEventLinkTable;
			return newState;
		default:
			return state
	}
}


