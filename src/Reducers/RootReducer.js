import { combineReducers } from 'redux';
import { UI } from './UI';
import { Users } from './User';
import { SedFF } from './SedFF';
import { SamplingEvents } from './SamplingEvents';
import { LinkTables } from './LinkTables';

const RootReducer = combineReducers({
	UI,
	Users,
	SedFF,
	SamplingEvents,
	LinkTables
  });
  
  export default RootReducer;