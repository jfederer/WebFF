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
	SHOW_NAVIGATION_TABS,
	HIDE_NAVIGATION_TABS,
	SHOW_PANELS,
	HIDE_PANELS,
	SHOW_QUESTIONS,
	HIDE_QUESTIONS
} from '../Constants/ActionTypes';

import { shouldDataEntryTabShow, shouldTablePagesShow } from '../Utils/UIUtilities';

import { DEFAULT_HIDDEN_NAVIGATION_TABS } from '../Constants/Config';

export function setNavMenuExpand(expandValue) {
	return { type: SET_NAV_MENU_EXPAND, expandValue: expandValue }
}

export function setSysMenuExpand(expandValue) {
	return { type: SET_SYS_MENU_EXPAND, expandValue: expandValue }
}

export function setLoginDialogVisibility(loginDialogVisibility) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_LOGIN_DIALOG_VISIBILITY, loginDialogVisibility: loginDialogVisibility }
}

export function setExportDialogVisibility(exportDialogVisibility) {  //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_EXPORT_DIALOG_VISIBILITY, exportDialogVisibility: exportDialogVisibility }
}

export function setAddRemoveStationDialogVisibility(addRemoveStationDialogVisibility) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY, addRemoveStationDialogVisibility: addRemoveStationDialogVisibility }
}

export function setAddRemoveQuestionDialogVisibility(addRemoveQuestionDialogVisibility) {//TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY, addRemoveQuestionDialogVisibility: addRemoveQuestionDialogVisibility }
}

export function setSettingsDialogVisibility(settingsDialogVisibility) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_SETTINGS_DIALOG_VISIBILITY, settingsDialogVisibility: settingsDialogVisibility }
}

export function setAboutDialogVisibility(aboutDialogVisibility) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ABOUT_DIALOG_VISIBILITY, aboutDialogVisibility: aboutDialogVisibility }
}

export function setSwitchUserDialogVisibility(switchUserDialogVisibility) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_SWITCH_USER_DIALOG_VISIBILITY, switchUserDialogVisibility: switchUserDialogVisibility }
}

export function setAppBarText(appBarText) {
	return { type: SET_APP_BAR_TEXT, appBarText: appBarText }
}

export function showNavigationTab(tabName) {
	let payload = [];
	payload.push(tabName);
	return { type: SHOW_NAVIGATION_TABS, payload }
}

export function hideNavigationTab(tabName) {
	let payload = [];
	payload.push(tabName);
	return { type: HIDE_NAVIGATION_TABS, payload }
}

export function hideNavigationTabs(tabArr) {
	return { type: HIDE_NAVIGATION_TABS, payload: tabArr }
}

export function showQuestionPanel(panelName) {
	let payload = [];
	payload.push([panelName]);  // show navigation panels expects an array of arrays with tabnames as the payload
	return { type: SHOW_PANELS, payload }
}

export function hideQuestionPanel(panelName) {
	let payload = [];
	payload.push([panelName]);  // hide navigation panels expects an array of arrays with tabnames as the payload
	return { type: HIDE_PANELS, payload }
}

export function showQuestion(QID_path) {
	let QID_paths = [];
	QID_paths.push(QID_path);  // hide navigation tabs expects an array of arrays with tabnames as the payload
	return { type: SHOW_QUESTIONS, QID_paths }
}

export function hideQuestion(QID_path) {
	let QID_paths = [];
	QID_paths.push(QID_path);  // hide navigation tabs expects an array of arrays with tabnames as the payload
	return { type: HIDE_QUESTIONS, QID_paths }
}

//automated update of navMenuItems based on methods selection, etc
export function updateNavMenu() {
	return (dispatch, getState) => {
		// reset hidden nav tabs
		dispatch(hideNavigationTabs(DEFAULT_HIDDEN_NAVIGATION_TABS))

		let currentSamplingEventID = getState().SedFF.currentSamplingEventID;

		if (currentSamplingEventID) {
			dispatch(showNavigationTab("Field Form"));


			//show/hide data entry tab
			if (shouldDataEntryTabShow(currentSamplingEventID)) {
				dispatch(showNavigationTab("Data Entry"));
				// conditionally show other tabs
				if (shouldTablePagesShow(currentSamplingEventID)) {
					dispatch(showNavigationTab("QWDATA"));
					dispatch(showNavigationTab("Parameters"));
				}
			} else {
				// if Data Entry tab shouldn't show, the QwDATA and Parameters tabs should go away too.
				dispatch(hideNavigationTab("Data Entry"));
				dispatch(hideNavigationTab("QWDATA"));
				dispatch(hideNavigationTab("Parameters"));
			}
		}
	}
}

