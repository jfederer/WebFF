import {
	SET_EVENT_TEMPLATE
	// SET_STATION,
	// ADD_QUESTION_TO_STATION,
	// DELETE_QUESTION_FROM_STATION,
	// STATION_PUSH,
	// STATION_PUSH_COMPLETE
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialStations = {

};

export function EventTemplates(state = initialStations, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_EVENT_TEMPLATE:
			newState[action.eventTemplate.eventTemplateID] = action.eventTemplate;
			return newState;
		// case ADD_QUESTION_TO_STATION:
		// 	newState[action.eventTemplateID].questionsData[action.question.id] = action.question;
		// 	newState[action.eventTemplateID].dateModified = new Date().toString();
		// 	return newState;
		// case DELETE_QUESTION_FROM_STATION:
		// 	delete newState[action.eventTemplateID].questionsData[action.QID];
		// 	newState[action.eventTemplateID].dateModified = new Date().toString();
		// 	return newState;
		// case STATION_PUSH:
		// case STATION_PUSH_COMPLETE:
		default:
			return state
	}
}
