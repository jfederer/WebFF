import { CREATE_NEW_SAMPLING_EVENT } from '../Constants/ActionTypes';

export function createNewSamplingEvent(eventID, eventName) {
	return { type: CREATE_NEW_SAMPLING_EVENT, eventID: eventID, eventName: eventName }
  }

