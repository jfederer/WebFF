import { SET_NAV_MENU_EXPAND, SET_SYS_MENU_EXPAND, SYS_MENU_ITEM_CLICKED} from '../Constants/ActionTypes';


export function setNavMenuExpand(expandValue) {
	return { type: SET_NAV_MENU_EXPAND, payload: expandValue }
  }
export function setSysMenuExpand(expandValue) {
	return { type: SET_SYS_MENU_EXPAND, payload: expandValue }
  }
export function systemMenuItemClicked(menuItem) {
	return { type: SYS_MENU_ITEM_CLICKED, payload: menuItem }
  }