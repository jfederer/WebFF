import { SET_CURRENT_USER } from '../Constants/ActionTypes';

export function setCurrentUser(username) {
	return { type: SET_CURRENT_USER, payload: username }
  }

  

