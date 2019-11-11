import _ from 'lodash';

import {
	CREATE_NEW_SAMPLING_EVENT,
	SET_SAMPLING_EVENT,
	SE_QUESTION_VALUE_CHANGE,
	ADD_QUESTION_TO_EVENT,
	DELETE_QUESTION_FROM_EVENT,
	SE_QUESTION_VALUE_DELETE,
  SAMPLING_EVENT_BANK_CHANGE,
  REQUEST_USER_SAMPLING_EVENTS,
  LOAD_COMPLETE_USER_SAMPLING_EVENTS
} from '../Constants/ActionTypes';




const initialState = {}


export function SamplingEvents(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case CREATE_NEW_SAMPLING_EVENT:
		case SET_SAMPLING_EVENT:
			newState[action.event.eventID] = action.event;
			return newState;
		case SE_QUESTION_VALUE_CHANGE:
			newState[action.eventID].questionsValues[action.questionID] = action.newValue;
			return newState;
		case SE_QUESTION_VALUE_DELETE:
			delete newState[action.eventID].questionsValues[action.questionID];
			return newState;
		case ADD_QUESTION_TO_EVENT:
			newState[action.eventID].questionsData[action.question.id] = action.question;
			return newState;
		case DELETE_QUESTION_FROM_EVENT:
			delete newState[action.eventID].questionsData[action.QID];
			return newState;
		case SAMPLING_EVENT_BANK_CHANGE:
			newState[action.eventID].questionsValues.waterwayInfo.bank = action.bank;
      return newState;
    case REQUEST_USER_SAMPLING_EVENTS:
      newState.isFetching = true;
      newState.didInvalidate = false;
      return newState;
    case LOAD_COMPLETE_USER_SAMPLING_EVENTS:
      newState.isFetching = false;
      newState.didInvalidate = false;
      if(Array.isArray(action.events)) {
        action.events.forEach(event => { newState[event.eventID]=event });
        //TODO: only update if event is newer  FIXME:  (do outside reducer)
      }
      return newState;
		default:
			return state;
	}
}
