import { combineReducers } from 'redux';
import { UI } from './UI';
import { Users } from './User';
import { SedFF } from './SedFF';
import { SamplingEvents } from './SamplingEvents';
import { StationsLinkTables } from './StationsLinkTables';
import { SamplingEventsLinkTables } from './SamplingEventsLinkTables';
import { Questions } from './Questions';
import { Stations } from './Stations';

const RootReducer = combineReducers({
	UI,
	Users,
	SedFF,
	SamplingEvents,
	Questions,  
	SamplingEventsLinkTables, 
	StationsLinkTables,
	Stations
  });
  
  export default RootReducer;