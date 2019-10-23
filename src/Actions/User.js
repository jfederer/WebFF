import _ from 'lodash';

import { 
	SET_OUTLINE_QUESTIONS, 
	SET_BACKUP_INTERVAL, 
	SET_SEDLOGIN_USERNAME,
	SET_USER_DATA
	} from '../Constants/ActionTypes';

import { emptyUser } from '../Constants/DefaultObjects';

export function setOutlineQuestions(username, useOutlineQuestions) {
	return { type: SET_OUTLINE_QUESTIONS, username, useOutlineQuestions }
  }

export function setBackupInterval(username, intervalInSeconds) {
	return { type: SET_BACKUP_INTERVAL, username, intervalInSeconds }
  }

export function setSedLoginUsername(username, newSedLoginUsername) {
	return { type: SET_SEDLOGIN_USERNAME, username, newSedLoginUsername }
  }
  
export function setUserData(user) {
	console.log("setUserData( ", user);
	return { type: SET_USER_DATA, user}
  }

export function makeNewUser(username) {
	let newUser = _.cloneDeep(emptyUser);
	newUser.username = username;
	newUser.dateModified = new Date();
	return setUserData(newUser)		
}
  

  

