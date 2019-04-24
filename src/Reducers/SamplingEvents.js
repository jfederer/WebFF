import _ from 'lodash';

import { 
	CREATE_NEW_SAMPLING_EVENT,
	SE_QUESTION_VALUE_CHANGE
 } from '../Constants/ActionTypes';




const initialState =  { //MOCK //TODO:
	"695833f2-e483-4c34-a962-d14f79037920": {
		eventID: "695833f2-e483-4c34-a962-d14f79037920",
		eventName: "Event1-JoeAndTom",
		dateModified: "Wed Jan 30 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionValues: {
			stationName: "station name from values",
			stationNumber: "1value2",
			question3: "1value3"
		}
	},
	"475c42c6-8642-4d0c-a98a-36d5374f00f4": {
		eventID: "475c42c6-8642-4d0c-a98a-36d5374f00f4",
		eventName: "Event2-TomOnly",
		dateModified: "Wed Jan 31 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionValues: {
			question4: "2value4",
			question5: "2value5",
			question6: "2value6"
		}
	},
	"dd8c3689-d8a8-42ef-bf9f-a52a52f611b8": {
		eventID: "dd8c3689-d8a8-42ef-bf9f-a52a52f611b8",
		eventName: "Event3-JoeOnly",
		dateModified: "Wed Jan 29 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Shipped",
		questionValues: {
			question1: "3value1",
			question2: "3value2",
			question3: "3value3",
			question4: "3value4",
			question5: "3value5",
			question6: "3value6"
		}
	}
}



// const initialEventsState = {};

export function SamplingEvents(state = initialState, action) {
		let newState = _.cloneDeep(state);
switch (action.type) {
	case CREATE_NEW_SAMPLING_EVENT:
		newState[action.event.eventID]=action.event; 
		return newState;
	case SE_QUESTION_VALUE_CHANGE:

	console.log("action.eventID", action.eventID)
	console.log("action.questionID", action.questionID)
	console.log("action.newValue", action.newValue);
	console.log(newState[action.eventID]);

		newState[action.eventID].questionValues[action.questionID] = action.newValue
		return newState;
	default:
		return state;
}
}
