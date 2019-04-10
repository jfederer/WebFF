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
	SET_SWITCH_USER_DIALOG_VISIBILITY,
	SET_APP_BAR_TEXT,
	SHOW_NAVIGATION_TAB
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
	},
	outlineQuestions: false,
	appBarText: "Sediment Field Forms"
};

export function UI(state = initialUIState, action) {
	let newState = _.cloneDeep(state);
	switch (action.type) {
		case SET_NAV_MENU_EXPAND:
			newState.visibility.expandedNavMenu = action.expandValue;
			break;
		case SET_SYS_MENU_EXPAND:
			newState.visibility.expandedSysMenu = action.expandValue;
			break;
		case SET_LOGIN_DIALOG_VISIBILITY:
			newState.visibility.loginDialogVisibility = action.loginDialogVisibility;
			break;
		case SET_EXPORT_DIALOG_VISIBILITY:
			newState.visibility.exportDialogVisibility = action.exportDialogVisibility;
			break;
		case SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveStationDialogVisibility = action.addRemoveStationDialogVisibility; 
			break;
		case SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY:
			newState.visibility.addRemoveQuestionDialogVisibility = action.addRemoveQuestionDialogVisibility;
			break;
		case SET_SETTINGS_DIALOG_VISIBILITY:
			newState.visibility.settingsDialogVisibility = action.settingsDialogVisibility;
			break;
		case SET_ABOUT_DIALOG_VISIBILITY:
			newState.visibility.aboutDialogVisibility = action.aboutDialogVisibility;
			break;
		case SET_SWITCH_USER_DIALOG_VISIBILITY:
			newState.visibility.switchUserDialogVisibility = action.switchUserDialogVisibility;
			break;
		case SET_APP_BAR_TEXT:
			newState.appBarText = action.appBarText;
			break;
		case SHOW_NAVIGATION_TAB: {
			newState.hiddenNavMenuItems = _.filter(state.hiddenNavMenuItems, (navMenuItem)=>navMenuItem.text!==action.tabName);
		}
		default:
			return state
	}
	return newState;
}

