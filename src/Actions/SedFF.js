import {
	SET_CURRENT_USERNAME,
	REQUEST_USER_DATA,
	RECEIVE_USER_DATA,
	LOAD_SAMPLING_EVENT
} from '../Constants/ActionTypes';


// likely need a 'load current user' and a 'set current user' as separate items...   load user -> request UD -> recieve UD -> set user ....

export function setCurrentUser(username) {
	// return { type: SET_CURRENT_USERNAME, username }
	return dispatch => {
			dispatch(requestUserData(username))
			return fetch('https://jsonplaceholder.typicode.com/users?username=Bret')
			.then(response => response.json())
			.then(json => dispatch(receiveUserData(json))) //last one in the 'then chain' needs to just be a standard object (I think)
	}
}

export function requestUserData(username) {
	return { type: REQUEST_USER_DATA, username: username }
}

export function receiveUserData(userdata) {
	return { type: RECEIVE_USER_DATA, userdata } //FUTURE: "received at"
}

export function loadSamplingEvent(eventID) {
	return { type: LOAD_SAMPLING_EVENT, eventID: eventID }
}



