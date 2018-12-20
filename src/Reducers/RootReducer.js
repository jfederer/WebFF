import { combineReducers } from 'redux';
import { UI } from './UI';
import { User } from './User';
import { SedFF } from './SedFF';

const RootReducer = combineReducers({
	UI,
	User,
	SedFF
  });
  
  export default RootReducer;