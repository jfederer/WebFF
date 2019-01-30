import { SET_CURRENT_USERNAME, LOAD_USER_DATA, LOAD_USER_DATA_TOO } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialLinkTablesState = {
		eventLinkTable : {
			"jfederer@usgs.gov": ["695833f2-e483-4c34-a962-d14f79037920", "dd8c3689-d8a8-42ef-bf9f-a52a52f611b8"],
			"tvanheel@usgs.gov": ["475c42c6-8642-4d0c-a98a-36d5374f00f4", "695833f2-e483-4c34-a962-d14f79037920"]
		}
};

export function LinkTables(state = initialLinkTablesState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		// case SET_CURRENT_USERNAME:
		// 	newState.currentUsername = action.payload
		//  	return newState;
		default:
			return state
	}
}
