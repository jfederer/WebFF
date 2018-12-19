import { } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialUserState = {
		username: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedInUser')) 
			: null, 
		sedLoginUsername: "",
		settings : {
			backupInterval : 300000,
			usePaper: false,
			customQuestions: []
		}
};

export function user(state = initialUserState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		// case SET_NAV_MENU_EXPAND:
		// 	newState.visibility.expandedNavMenu = action.payload;
		// 	return newState;
		// case SET_SYS_MENU_EXPAND:
		// 	newState.visibility.expandedSysMenu = action.payload;
		// 	return newState;
		// case SYS_MENU_ITEM_CLICKED: {
		// 	return { ...state, expandedSysMenu: false }
		// }
		default:
			return state
	}
}
