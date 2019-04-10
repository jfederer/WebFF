import { CREATE_NEW_SAMPLING_EVENT } from '../Constants/ActionTypes';
import { emptySamplingEvent } from '../Constants/SamplingEvent';
import _ from 'lodash';
import uuidv4 from 'uuid';

export function createNewSamplingEvent(eventName) {
	return dispatch => {
		setTimeout(() => {
			let newEvent = _.cloneDeep(emptySamplingEvent);
			newEvent.eventID = uuidv4();
			if (!eventName) { // if no event name give, the event name will be the date
				let today = new Date();
				let monthName = today.toLocaleString('en-us', { month: 'long' });
				let dd = String(today.getDate()).padStart(2, '0');
				let yyyy = today.getFullYear();

				eventName = "Sampling Event on " + yyyy + " " + monthName + " " + dd;
			}

			newEvent.eventName = eventName  //TODO: should be calling setEventName action instead?

			newEvent.dateModified = new Date(); //TODO: should be calling eventModified action instead?

			//TODO: call an optional callback 
			//TODO: dispatch eventLinkTable event

			console.log("Returning");
			return { type: CREATE_NEW_SAMPLING_EVENT, event: newEvent }
		}, 2000);
	}
}

