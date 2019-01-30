import { SET_CURRENT_USERNAME, LOAD_USER_DATA } from '../Constants/ActionTypes';

export function setCurrentUser(username) {
	// return { type: SET_CURRENT_USER, payload: username }
	return dispatch => {
		dispatch( { type: SET_CURRENT_USERNAME, payload: username } );
		dispatch( loadUserData(username) );
	}
}

export function loadUserData(username) {
	return { type: LOAD_USER_DATA, payload: username }
}




