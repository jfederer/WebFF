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
	SET_APP_BAR_TEXT
} from '../Constants/ActionTypes';


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

export function setAppBarText(appBarText) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_APP_BAR_TEXT, appBarText: appBarText }
}

