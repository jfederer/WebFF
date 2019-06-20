import _ from 'lodash';
import {getEventFromID} from './StoreUtilities';
import { SET_INFORMATION_IDENTIFIER } from '../Constants/Config';

export function handleNumberOfSamplingPointsChanged(eventID, setName, samplingMethod, value) {
	console.log("Global number of sampling points handler: ", eventID, setName, samplingMethod, value);

	let event = getEventFromID(eventID);
	////// modify setInfo table //////
	// make it the correct size (confirm with user if shrinking)
	
	let setInfoSampleTable = event.questionsValues[SET_INFORMATION_IDENTIFIER+setName]["samplesTable_" + samplingMethod];
	

	// re-do any distance data (confirm with user)

	////// modify QWDATA table //////TODO:

	////// modify Parameters table //////TODO:
}