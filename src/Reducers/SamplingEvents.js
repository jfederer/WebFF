import _ from 'lodash';

import {
	CREATE_NEW_SAMPLING_EVENT,
	SE_QUESTION_VALUE_CHANGE,
	ADD_QUESTION_TO_EVENT,
	DELETE_QUESTION_FROM_EVENT
} from '../Constants/ActionTypes';




const initialState = { //MOCK //TODO:
	"695833f2-e483-4c34-a962-d14f79037920": {
		eventID: "695833f2-e483-4c34-a962-d14f79037920",
		eventName: "Event1-JoeAndTom",
		dateModified: "Wed Jan 30 2019 12:44:59 GMT-0600 (Central Standard Time)",
		shippedStatus: "Not Shipped",
		questionsValues: {
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
		questionsValues: {
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
		questionsValues: {
			question1: "3value1",
			question2: "3value2",
			question3: "3value3",
			question4: "3value4",
			question5: "3value5",
			question6: "3value6"
		}
	}
}





export function SamplingEvents(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case CREATE_NEW_SAMPLING_EVENT:
			newState[action.event.eventID] = action.event;
			return newState;
		case SE_QUESTION_VALUE_CHANGE:
			newState[action.eventID].questionsValues[action.questionID] = action.newValue;
			return newState;
		case ADD_QUESTION_TO_EVENT:
			newState[action.eventID].questionsData[action.question.id] = action.question;
			return newState;
		case DELETE_QUESTION_FROM_EVENT:
			delete newState[action.eventID].questionsData[action.QID];
			return newState;
		default:
			return state;
	}
}
