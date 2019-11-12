import {
	SET_STATION,
	ADD_QUESTION_TO_STATION,
	DELETE_QUESTION_FROM_STATION,
	STATION_PUSH,
	STATION_PUSH_COMPLETE
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialStations = {

};

export function Stations(state = initialStations, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_STATION:
			newState[action.station.stationID] = action.station;
			return newState;
		case ADD_QUESTION_TO_STATION:
			newState[action.stationID].questionsData[action.question.id] = action.question;
			newState[action.stationID].dateModified = new Date().toString();
			return newState;
		case DELETE_QUESTION_FROM_STATION:
			delete newState[action.stationID].questionsData[action.QID];
			newState[action.stationID].dateModified = new Date().toString();
			return newState;
		case STATION_PUSH:
		case STATION_PUSH_COMPLETE:
		default:
			return state
	}
}
