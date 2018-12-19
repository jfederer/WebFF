import { combineReducers } from 'redux';
import { UI } from './UI';
import { user } from './User';

const RootReducer = combineReducers({
	UI,
	user
  });
  
  export default RootReducer;