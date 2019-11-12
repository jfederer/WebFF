import {
	SET_STATION,
	ADD_QUESTION_TO_STATION,
	DELETE_QUESTION_FROM_STATION
} from '../Constants/ActionTypes';
import _ from 'lodash';

const initialStations = {
	// "0c4ef4d8-6041-414b-9456-f8f2dd6c2575": {
	// 	stationID: "0c4ef4d8-6041-414b-9456-f8f2dd6c2575",
	// 	displayName: "Station 1 Display Name",
	// 	name: "Station 1 full name at whatever river",
	// 	number: "1111",
	// 	defaultProjectName: "Default 1Project",
	// 	defaultProjectID: "Default 1ID",
	// 	defaultAgencyCode: "Def1Ag",
	// 	defaultBank:"Left Bank",
	// 	questionsData:{}
	// },
	// "d4e95192-00a4-4ef7-baa1-7827f50c7c67": {
	// 	stationID: "d4e95192-00a4-4ef7-baa1-7827f50c7c67",
	// 	displayName: "Station 2 Display Name",
	// 	name: "Station 2 full name at whatever river",
	// 	number: "2222",
	// 	defaultProjectName: "Default 2 Project",
	// 	defaultProjectID: "Default 2 ID",
	// 	defaultAgencyCode: "Def2Ag",
	// 	defaultBank:"Right Bank",
	// 	questionsData:{}
	// },
	// "d4e95192-00a4-4ef7-baa1-7827f50c7c68": {
	// 	stationID: "d4e95192-00a4-4ef7-baa1-7827f50c7c68",
	// 	displayName: "NEVER SEE",
	// 	name: "Station 2 full name at whatever river",
	// 	number: "9999",
	// 	defaultProjectName: "Default Project",
	// 	defaultProjectID: "Default ID",
	// 	defaultAgencyCode: "DefAg",
	// 	questionsData:{}
	// },
	// '8b444434-2f01-4c05-80b1-06a7518bdf23': {
	// 	displayName: 'Station2',
	// 	name: 'Station2',
	// 	number: '11111',
	// 	defaultProjectName: 'PRoj1',
	// 	defaultProjectID: 'ID1',
	// 	defaultAgencyCode: 'USGS',
	// 	defaultBank:"Right Bank",
	// 	questionsData: {},
	// 	stationID: '8b444434-2f01-4c05-80b1-06a7518bdf23'
	//   }

};

export function Stations(state = initialStations, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_STATION:
			newState[action.station.stationID] = action.station;
			return newState;
		case ADD_QUESTION_TO_STATION:
			newState[action.stationID].questionsData[action.question.id] = action.question;
			newState[action.stationID].dateModified = new Date();
			return newState;
		case DELETE_QUESTION_FROM_STATION:
			delete newState[action.stationID].questionsData[action.QID];
			newState[action.stationID].dateModified = new Date();
			return newState;
		default:
			return state
	}
}
