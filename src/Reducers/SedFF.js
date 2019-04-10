import { 
	SET_CURRENT_USERNAME, 
	LOAD_USER_DATA, 
	REQUEST_USER_DATA,
	RECEIVE_USER_DATA,
	LOAD_SAMPLING_EVENT } from '../Constants/ActionTypes';
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
		case REQUEST_USER_DATA:
		console.log("set is fetching to true");
			newState.isFetchingUserData = true;
			return newState;
		case RECEIVE_USER_DATA:
			//TODO:
			console.log("set is fetching to false");
			newState.isFetchingUserData = false;
			return newState
		case LOAD_SAMPLING_EVENT:
			//TODO:
			return newState;
		default:
			return state
	}
}
