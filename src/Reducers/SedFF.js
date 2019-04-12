import { 
	SET_CURRENT_USERNAME, 
	LOAD_USER_DATA, 
	REQUESTING_USER_DATA,
	RECEIVED_USER_DATA,
	MAKE_NEW_USER,
	LOAD_SAMPLING_EVENT,
	USER_DATA_LOAD_COMPLETE } from '../Constants/ActionTypes';
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
		case LOAD_USER_DATA:
			//TODO: 
			 return newState;
		case REQUESTING_USER_DATA:
			newState.isFetchingUserData = true;
			return newState;
		case RECEIVED_USER_DATA:
			//TODO:
			newState.isFetchingUserData = false;
			return newState
		case USER_DATA_LOAD_COMPLETE:
			//TODO:
			newState.isFetchingUserData = false;
			return newState
		case LOAD_SAMPLING_EVENT:
			//TODO:
			return newState;
		case MAKE_NEW_USER:
			//TODO:
			return newState;
		default:
			return state
	}
}
