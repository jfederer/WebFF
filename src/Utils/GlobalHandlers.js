import _ from 'lodash';
import {getEventFromID} from './StoreUtilities';

export function handleNumberOfSamplingPointsChanged(eventID, setName, value) {
	console.log("Global number of sampling points handler: ", eventID, setName, value);

	let event = getEventFromID(eventID);
	// modify setInfo table
		// make it the correct size (confirm with user if shrinking)



		// re-do any distance data (confirm with user)

	// modify QWDATA table

	// modify Parameters table
}