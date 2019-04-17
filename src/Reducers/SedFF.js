import {
	SET_CURRENT_USERNAME,
	USER_DATA_REQUEST,
	USER_DATA_LOAD_COMPLETE,
	SAMPLING_EVENTS_REQUEST,
	SAMPLING_EVENTS_LOAD_COMPLETE,
	SAMPLING_EVENT_REQUEST,
	SAMPLING_EVENT_LOAD_COMPLETE
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialSedFFState = {
	currentUsername: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
		? JSON.parse(localStorage.getItem('loggedInUser'))
		// : null,
		: "jfederer@usgs.gov",
	currentEvent: null,
	isFetchingUserData: true
};

export function SedFF(state = initialSedFFState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {

		case SET_CURRENT_USERNAME:
			newState.currentUsername = action.username
			return newState;

		case USER_DATA_REQUEST:
			newState.isFetchingUserData = true;
			return newState;
		case USER_DATA_LOAD_COMPLETE:
			newState.isFetchingUserData = false;
			return newState

		case SAMPLING_EVENTS_REQUEST:
			newState.isFetchingEventData = true;
			return newState;
		case SAMPLING_EVENTS_LOAD_COMPLETE:
			newState.isFetchingEventData = false;
			return newState;

		case SAMPLING_EVENT_REQUEST:
			newState.isFetchingEventData = true;
			return newState;
		case SAMPLING_EVENT_LOAD_COMPLETE:
			newState.isFetchingEventData = false;
			return newState;

		default:
			return state
	}
}
