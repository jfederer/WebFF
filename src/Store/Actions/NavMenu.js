import { SET_NAV_MENU_EXPAND } from "../../Constants/ActionTypes";
import { TOGGLE_NAV_MENU_EXPAND } from "../../Constants/ActionTypes";

export const setNavMenuExpand = (isExpanded) => {
	return { type: SET_NAV_MENU_EXPAND, payload: isExpanded };
}

export const toggleNavMenuExpand = () => {
	return { type: TOGGLE_NAV_MENU_EXPAND };
}