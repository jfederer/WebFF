import _ from 'lodash';
import uuidv4 from 'uuid';

import {
	CREATE_NEW_SAMPLING_EVENT,
	REGISTER_EVENT_WITH_USERNAME
} from '../Constants/ActionTypes';
import { emptySamplingEvent } from '../Constants/DefaultObjects';


export function createNewSamplingEvent(eventName) {
	/* 
	@desc syncronous function creates new, blank event based on template
	@param eventName {string} - the new event name.  If empty string, will be given date-based name
	@returns the eventID of the newly created event  (note, up to the reciever to link user and event in eventLinkTable)
	*/
	return dispatch => {
		let newEvent = _.cloneDeep(emptySamplingEvent);
		newEvent.eventID = uuidv4();
		if (!eventName) { // if no event name give, the event name will be the date //FUTURE: build a setting for the default event name
			let today = new Date();
			let monthName = today.toLocaleString('en-us', { month: 'long' });
			let dd = String(today.getDate()).padStart(2, '0');
			let yyyy = today.getFullYear();

			eventName = "Sampling Event on " + yyyy + " " + monthName + " " + dd;
		}

		newEvent.eventName = eventName;  //OPTIMIZE: should be calling setEventName action instead?

		newEvent.dateModified = new Date().toString(); //OPTIMIZE: should be calling eventModified action instead?

		//OPTIMIZE: call an optional callback 

		dispatch({ type: CREATE_NEW_SAMPLING_EVENT, event: newEvent });
		return (newEvent.eventID);
	}
}


export function createNewSampingEventForUser(eventName, username) {
	return dispatch => {
		let eventID = dispatch(createNewSamplingEvent(eventName));
		dispatch({ type: REGISTER_EVENT_WITH_USERNAME, eventID, username });
		return eventID;
	}
}
