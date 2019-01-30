import { SET_CURRENT_USERNAME, LOAD_USER_DATA, LOAD_USER_DATA_TOO } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialSedFFState = {
		currentUsername: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedInUser')) 
			// : null,
			: "mERP",
		currentEvent: null
};

export function SedFF(state = initialSedFFState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_CURRENT_USERNAME:
			newState.currentUsername = action.payload
		 	return newState;
		case LOAD_USER_DATA:
			//TODO: 
		 	return newState;
		case LOAD_USER_DATA_TOO:
			//TODO: 
		 	return newState;
		default:
			return state
	}
}
