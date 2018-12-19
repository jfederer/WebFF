import { SET_NAV_MENU_EXPAND, SET_SYS_MENU_EXPAND, SET_LOGIN_DIALOG_VISIBILITY } from '../Constants/ActionTypes';


export function setNavMenuExpand(expandValue) {
	return { type: SET_NAV_MENU_EXPAND, payload: expandValue }
  }
  
export function setSysMenuExpand(expandValue) {
	return { type: SET_SYS_MENU_EXPAND, payload: expandValue }
  }

export function setLoginDialogVisibility(visibilityValue) { 
	return { type: SET_LOGIN_DIALOG_VISIBILITY, payload: visibilityValue }
  }
