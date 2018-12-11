import { combineReducers } from 'redux';
import SimpleReducer from './SimpleReducer';

// export default combineReducers({
//     SimpleReducer
//    });

import {ADD_ARTICLE} from '../Constants/ActionTypes';

const initialState = {
	articles: []
  };
  const rootReducer = (state = initialState, action) => {
	switch (action.type) {
	  case ADD_ARTICLE:
		return { ...state, articles: [...state.articles, action.payload] };
	  default:
		return state;
	}
  };

  export default rootReducer;