// import { combineReducers } from 'redux';
// import SimpleReducer from './SimpleReducer';

import { initialState } from '../InitialState';
import { SET_NAV_MENU_EXPAND } from '../../Constants/ActionTypes';


const rootReducer = (state = initialState, action) => {
	const newState = {...state};

	switch (action.type) {
		case SET_NAV_MENU_EXPAND:
			newState.navMenuExpanded = action.payload;
			return newState;
		default:
			return state;
	}
};

export default rootReducer;