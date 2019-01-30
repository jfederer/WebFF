import { combineReducers } from 'redux';
import { UI } from './UI';
import { Users } from './User';
import { SedFF } from './SedFF';
import { Events } from './Events';
import { LinkTables } from './LinkTables';

const RootReducer = combineReducers({
	UI,
	Users,
	SedFF,
	Events,
	LinkTables
  });
  
  export default RootReducer;