import {TOGGLE_NAV_MENU_EXPAND, SET_NAV_MENU_EXPAND} from '../Constants/ActionTypes';

export function toggleNavMenuExpand() {
	//TODO: use setNavMenuExpand for this
	return { type: TOGGLE_NAV_MENU_EXPAND }
}

export function setNavMenuExpand(expandValue) {
	return { type: SET_NAV_MENU_EXPAND, payload: expandValue }
  }