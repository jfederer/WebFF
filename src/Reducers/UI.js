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
	SHOW_PANELS,
	HIDE_PANELS,
	SHOW_NAVIGATION_TABS,
	HIDE_NAVIGATION_TABS,
} from '../Constants/ActionTypes';

import { DEFAULT_HIDDEN_NAVIGATION_TABS, DEFAULT_HIDDEN_PANELS } from '../Constants/Config';



const initialUIState = {
	visibility: {
		expandedNavMenu: false,
		expandedSysMenu: false,
		loginDialogVisibility: false,
		hiddenNavMenuItems: DEFAULT_HIDDEN_NAVIGATION_TABS,
		hiddenPanels: DEFAULT_HIDDEN_PANELS,
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
		case SHOW_NAVIGATION_TABS:
			let tabsToShow = action.payload.map((tabName) => tabName.replace(/\s/g,''));
			newState.visibility.hiddenNavMenuItems = newState.visibility.hiddenNavMenuItems.filter((tabName) => !tabsToShow.includes(tabName));
			break;
		case HIDE_NAVIGATION_TABS:
			let tabsToHide = action.payload.map((tabName) => tabName.replace(/\s/g,''));
			newState.visibility.hiddenNavMenuItems = newState.visibility.hiddenNavMenuItems.concat(tabsToHide);
			break;
		case SHOW_PANELS:
			let panelsToShow = action.payload.map((panelsArr) => panelsArr[0].replace(/\s/g,''));
			newState.visibility.hiddenPanels = newState.visibility.hiddenPanels.filter((panelName) => !panelsToShow.includes(panelName));
			break;
		case HIDE_PANELS:
			let panelsToHide = action.payload.map((panelsArr) => panelsArr[0].replace(/\s/g,''));
			newState.visibility.hiddenPanels = newState.visibility.hiddenPanels.concat(panelsToHide);
			break;
		default:
			return state
	}
	return newState;
}

