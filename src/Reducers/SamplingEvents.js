import _ from 'lodash';

import { 
	CREATE_NEW_SAMPLING_EVENT } from '../Constants/ActionTypes';




const initialState =  [ //MOCK //TODO:
	{
		eventID: "695833f2-e483-4c34-a962-d14f79037920",
		eventName: "Event1-JoeAndTom",
		dateModified: "Wed Jan 30 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionValues: {
			question1: "1value1",
			question2: "1value2",
			question3: "1value3"
		}
	},{
		eventID: "475c42c6-8642-4d0c-a98a-36d5374f00f4",
		eventName: "Event2-TomOnly",
		dateModified: "Wed Jan 31 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionValues: {
			question4: "2value4",
			question5: "2value5",
			question6: "2value6"
		}
	},{
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
]



// const initialEventsState = {};

export function SamplingEvents(state = initialState, action) {
		let newState = _.cloneDeep(state);
switch (action.type) {
	case CREATE_NEW_SAMPLING_EVENT:
		newState.push(action.event); // push acceptable because newState is a already a clone
		return newState;
	default:
		return state
}
}
