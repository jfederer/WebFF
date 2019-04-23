import _ from 'lodash';

// import { 
// 	CREATE_NEW_SAMPLING_EVENT } from '../Constants/ActionTypes';


import { defaultQuestionsData } from './../Constants/DefaultObjects';

const initialState =  defaultQuestionsData;

export function Questions(state = initialState, action) {
		// let newState = _.cloneDeep(state);
switch (action.type) {
	// case CREATE_NEW_SAMPLING_EVENT:
	// 	newState[action.event.eventID]=action.event; // push acceptable because newState is a already a clone
	// 	return newState;
	default:
		return state;
}
}
