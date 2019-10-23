import {
	REGISTER_EVENT_WITH_USERNAME,
	REGISTER_STATION_WITH_USERNAME,
	REMOVE_STATION_FROM_USERNAME
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialEventLinkTableState = {
	"userEvents": {
		'jfederer@usgs.gov': [
			'695833f2-e483-4c34-a962-d14f79037920',
			'dd8c3689-d8a8-42ef-bf9f-a52a52f611b8',
			'2a22be8e-aa07-41ef-81b2-6b09f8752075'
		],
		"test@usgs.gov": ["475c42c6-8642-4d0c-a98a-36d5374f00f4", "695833f2-e483-4c34-a962-d14f79037920"]
	},
	"userStations": {
		// "jfederer@usgs.gov": ["0c4ef4d8-6041-414b-9456-f8f2dd6c2575", "d4e95192-00a4-4ef7-baa1-7827f50c7c67"]
		// "jfederer@usgs.gov": [] //TODO: generate blank when new user made?
	}
};

export function LinkTables(state = initialEventLinkTableState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case REGISTER_EVENT_WITH_USERNAME:
			newState.userEvents[action.username].push(action.eventID); // push acceptable on clone  //FIXME: fails if user doesn't exist in list
			return newState;
		case REGISTER_STATION_WITH_USERNAME:
			newState.userStations[action.username].push(action.stationID); // push acceptable on clone //FIXME: fails if user doesn't exist in list
			return newState;
		case REMOVE_STATION_FROM_USERNAME: 
			newState.userStations[action.username] = newState.userStations[action.username].filter((linkedStationID)=>linkedStationID!==action.stationIDToRemove);
			//TODO: actually deleting the station, not just the link - optionally looking at the network and other users.
			return newState;
		default:
			return state
	}
}
