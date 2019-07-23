import { 
	SET_STATION_VALUES
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialStations = {
			"0c4ef4d8-6041-414b-9456-f8f2dd6c2575": {
				stationID: "0c4ef4d8-6041-414b-9456-f8f2dd6c2575",
				displayName: "Station Display Name",
				name: "Station full name at whatever river",
				number: "1234",
				defaultProject: "Default Project",
				defaultProjectID: "Default ID",
				defaultAgencyCode: "DefAg"
			},
			"d4e95192-00a4-4ef7-baa1-7827f50c7c67": {
				stationID: "d4e95192-00a4-4ef7-baa1-7827f50c7c67",
				displayName: "Station 2 Display Name",
				name: "Station 2 full name at whatever river",
				number: "9999",
				defaultProject: "Default 2 Project",
				defaultProjectID: "Default 2 ID",
				defaultAgencyCode: "Def2Ag"
			},
			"d4e95192-00a4-4ef7-baa1-7827f50c7c68": {
				stationID: "d4e95192-00a4-4ef7-baa1-7827f50c7c68",
				displayName: "NEVER SEE",
				name: "Station 2 full name at whatever river",
				number: "9999",
				defaultProject: "Default Project",
				defaultProjectID: "Default ID",
				defaultAgencyCode: "DefAg"
			}

		};

export function Stations(state = initialStations, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_STATION_VALUES:
			newState[action.station.stationID] = action.station; 
			  return newState;
		default:
			return state
	}
}
