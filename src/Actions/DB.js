import { SYNC_ALL_TO_DB } from '../Constants/ActionTypes';


export function syncToDB() { 
	return { type: SYNC_ALL_TO_DB }
  }
  