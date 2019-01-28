import { SET_CURRENT_USER } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialSedFFState = {
		currentUser: (localStorage.getItem('loggedInUser')) && localStorage.getItem('loggedInUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedInUser')) 
			// : null,
			: "mERP",
		currentEvent: null
};

export function SedFF(state = initialSedFFState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_CURRENT_USER:
			newState.currentUser = action.payload
		 	return newState;
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
