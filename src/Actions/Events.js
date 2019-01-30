import { CREATE_NEW_EVENT } from '../Constants/ActionTypes';

export function createNewEvent(eventName) {
	return { type: CREATE_NEW_EVENT, eventName: eventName }
  }

