import _ from 'lodash';
import {
	SET_NAV_MENU_EXPAND, 
	SET_SYS_MENU_EXPAND, 
	SET_LOGIN_DIALOG_VISIBILITY, 
	SET_EXPORT_DIALOG_VISIBILITY,
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
		loginDialogVisibility: false,
		hiddenNavMenuItems: defaultHiddenNavMenuItems,
		exportDialogVisibility: false,
		addRemoveStationDialogVisibility: false,
		addRemoveQuestionDialogVisibility: false,
		settingsDialogVisibility: false,
		aboutDialogVisibility: false,
		switchUserDialogVisibility: false
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
			newState.visibility.loginDialogVisibility = action.payload;
			break;
		case SET_EXPORT_DIALOG_VISIBILITY:
			newState.visibility.exportDialogVisibility = action.payload;
			break;
		case SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveStationDialogVisibility = action.payload;
			break;
		case SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveQuestionDialogVisibility = action.payload;
			break;
		case SET_SETTINGS_DIALOG_VISIBILITY:
			newState.visibility.settingsDialogVisibility = action.payload;
			break;
		case SET_ABOUT_DIALOG_VISIBILITY:
			newState.visibility.aboutDialogVisibility = action.payload;
			break;
		case SET_SWITCH_USER_DIALOG_VISIBILITY:
			newState.visibility.switchUserDialogVisibility = action.payload;
			break;
		default:
			return state
	}
	return newState;
}

