import { TOGGLE_NAV_MENU_EXPAND, SET_NAV_MENU_EXPAND } from '../Constants/ActionTypes';

initialState = {}

function UIReducer(state = initialState, action) {
	switch (action.type) {
	  case TOGGLE_NAV_MENU_EXPAND,
		return action.payload //TODO: set opposite of current state
	  case SET_NAV_MENU_EXPAND,
		return action.payload
	  default:
		return state
	}
  }