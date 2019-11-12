import {
	REGISTER_EVENT_WITH_USERNAME,
	SAMPLING_EVENTS_LINK_TABLE_SET
} from '../Constants/ActionTypes';

import _ from 'lodash';

const initialState = {
	
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
		case SAMPLING_EVENTS_LINK_TABLE_SET: 
			newState[action.samplingEventsLinkTable.username]=action.samplingEventsLinkTable;
			return newState;
		default:
			return state
	}
}


