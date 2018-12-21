import { SET_NAV_MENU_EXPAND, SET_SYS_MENU_EXPAND, SYS_MENU_ITEM_CLICKED } from '../Constants/ActionTypes';
import { defaultHiddenNavMenuItems } from '../Constants/NavMenu';
import _ from 'lodash';

const initialUIState = {
	visibility: {
		expandedNavMenu: false,
		expandedSysMenu: false,
		loginDialog: false,
		hiddenNavMenuItems: defaultHiddenNavMenuItems
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
		// case SYS_MENU_ITEM_CLICKED: { //TODO: reducer needs to be made for dialog visibility
		// 	return { ...state, expandedSysMenu: false }
		// }
		default:
			return state
	}
	return newState;
}

