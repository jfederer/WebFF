import { SET_NAV_MENU_EXPAND, SET_SYS_MENU_EXPAND, SYS_MENU_ITEM_CLICKED } from '../Constants/ActionTypes';

const initialUIState = {
	navMenuExpanded:false,
	sysMenuExpanded:false
};

export function UI(state = initialUIState, action) {
	switch (action.type) {
	  case SET_NAV_MENU_EXPAND:
		return {...state, navMenuExpanded: action.payload}
	  case SET_SYS_MENU_EXPAND:
		return {...state, sysMenuExpanded: action.payload}
		case SYS_MENU_ITEM_CLICKED: {
			return {...state, sysMenuExpanded: false}
		}
	  default:
		return state
	}
  }

  