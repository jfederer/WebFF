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


export function setNavMenuExpand(expandValue) {
	return { type: SET_NAV_MENU_EXPAND, payload: expandValue }
}

export function setSysMenuExpand(expandValue) {
	return { type: SET_SYS_MENU_EXPAND, payload: expandValue }
}

export function setLoginDialogVisibility(visibilityValue) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_LOGIN_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setExportDialogVisibility(visibilityValue) {  //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_EXPORT_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setAddRemoveStationDialogVisibility(visibilityValue) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ADD_REMOVE_STATION_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setAddRemoveQuestionDialogVisibility(visibilityValue) {//TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ADD_REMOVE_QUESTION_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setSettingsDialogVisibility(visibilityValue) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_SETTINGS_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setAboutDialogVisibility(visibilityValue) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_ABOUT_DIALOG_VISIBILITY, payload: visibilityValue }
}

export function setSwitchUserDialogVisibility(visibilityValue) { //TODO:  (if visitibility... show... if not, clear and hide)
	return { type: SET_SWITCH_USER_DIALOG_VISIBILITY, payload: visibilityValue }
}

