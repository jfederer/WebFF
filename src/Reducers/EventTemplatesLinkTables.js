import {
	REGISTER_EVENT_TEMPLATE_WITH_USERNAME,
	REMOVE_EVENT_TEMPLATE_FROM_USERNAME,
	EVENT_TEMPLATE_LINK_TABLE_SET
} from '../Constants/ActionTypes';

import _ from 'lodash';

const initialState = {

};

export function EventTemplatesLinkTables(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case REGISTER_EVENT_TEMPLATE_WITH_USERNAME:
			if (!newState[action.username]) {
				newState[action.username] = { username: action.username, eventTemplates: [] }
			}
			newState[action.username].eventTemplates.push(action.eventTemplateID); // push acceptable on clone
			newState[action.username].dateModified = new Date().toString();
			return newState;

		case REMOVE_EVENT_TEMPLATE_FROM_USERNAME:
			newState[action.username].eventTemplates = newState[action.username].eventTemplates.filter((linkedEventTemplateID) => linkedEventTemplateID !== action.eventTemplateIDToRemove);
			newState[action.username].dateModified = new Date().toString();
			//TODO: actually deleting the event?, not just the link - optionally looking at the network and other users/events to see if station is still used...
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
		case EVENT_TEMPLATE_LINK_TABLE_SET:
			newState[action.eventTemplatesLinkTable.username] = action.eventTemplatesLinkTable;
			return newState;
		default:
			return state
	}
}


