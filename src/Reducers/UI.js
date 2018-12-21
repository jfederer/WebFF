import _ from 'lodash';
import {
	SET_NAV_MENU_EXPAND, 
	SET_SYS_MENU_EXPAND, 
	SET_LOGIN_DIALOG_VISIBILITY, 
	SET_IO_DIALOG_VISIBILITY,
	SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY,
	SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY,
	SET_SETTINGS_DIALOG_VISIBILITY,
	SET_ABOUT_DIALOG_VISIBILITY,
	SET_SWITCH_USER_DIALOG_VISIBILITY
} from '../Constants/ActionTypes';

import { defaultHiddenNavMenuItems } from '../Constants/NavMenu';


const initialUIState = {
	visibility: {
		expandedNavMenu: false,
		expandedSysMenu: false,
		loginDialog: false,
		hiddenNavMenuItems: defaultHiddenNavMenuItems,
		IODialog: false,
		addRemoveStationDialog: false,
		addRemoveQuestionDialog: false,
		settingsDialog: false,
		aboutDialog: false,
		switchUserDialog: false
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
		case SET_LOGIN_DIALOG_VISIBILITY:
			newState.visibility.loginDialog = action.payload;
			break;
		case SET_IO_DIALOG_VISIBILITY:
			newState.visibility.IODialog = action.payload;
			break;
		case SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveStationDialog = action.payload;
			break;
		case SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveQuestionDialog = action.payload;
			break;
		case SET_SETTINGS_DIALOG_VISIBILITY:
			newState.visibility.settingsDialog = action.payload;
			break;
		case SET_ABOUT_DIALOG_VISIBILITY:
			newState.visibility.aboutDialog = action.payload;
			break;
		case SET_SWITCH_USER_DIALOG_VISIBILITY:
			newState.visibility.switchUserDialog = action.payload;
			break;
		default:
			return state
	}
	return newState;
}

