import _ from 'lodash';

import {
	CREATE_NEW_SAMPLING_EVENT,
	SAMPLING_EVENT_SET,
	SE_QUESTION_VALUE_CHANGE,
	ADD_QUESTION_TO_EVENT,
	DELETE_QUESTION_FROM_EVENT,
	SE_QUESTION_VALUE_DELETE,
  SAMPLING_EVENT_BANK_CHANGE,
  USER_SAMPLING_EVENTS_REQUEST,
  USER_SAMPLING_EVENTS_LOAD_COMPLETE
} from '../Constants/ActionTypes';




const initialState = {}


export function SamplingEvents(state = initialState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case CREATE_NEW_SAMPLING_EVENT:
		case SAMPLING_EVENT_SET:
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
    case USER_SAMPLING_EVENTS_REQUEST:
      newState.isFetching = true;
      newState.didInvalidate = false;
      return newState;
    case USER_SAMPLING_EVENTS_LOAD_COMPLETE:
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
