import { SET_NAV_MENU_EXPAND, SET_SYS_MENU_EXPAND, SYS_MENU_ITEM_CLICKED } from '../Constants/ActionTypes';
import _ from 'lodash';

const initialUIState = {
	visibility: {
		expandedNavMenu: false,
		expandedSysMenu: false,
		loginDialog: false
	}
};

export function UI(state = initialUIState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_NAV_MENU_EXPAND:
			newState.visibility.expandedNavMenu = action.payload;
			break;
		case SET_SYS_MENU_EXPAND:
			newState.visibility.expandedSysMenu = action.payload;
			break;
		// case SYS_MENU_ITEM_CLICKED: {
		// 	return { ...state, expandedSysMenu: false }
		// }
		default:
			return state
	}
	return newState;
}

