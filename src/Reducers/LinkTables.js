import { 
	REGISTER_EVENT_WITH_USERNAME
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialEventLinkTableState = {
	"userEvents": {
			"jfederer@usgs.gov": ["695833f2-e483-4c34-a962-d14f79037920", "dd8c3689-d8a8-42ef-bf9f-a52a52f611b8"],
			"tvanheel@usgs.gov": ["475c42c6-8642-4d0c-a98a-36d5374f00f4", "695833f2-e483-4c34-a962-d14f79037920"]
	}
		};

export function LinkTables(state = initialEventLinkTableState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case REGISTER_EVENT_WITH_USERNAME:
			newState.userEvents[action.username].push(action.eventID); // push acceptable on clone
		  	return newState;
		default:
			return state
	}
}
