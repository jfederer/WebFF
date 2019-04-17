import _ from 'lodash';

import { 
	SET_OUTLINE_QUESTIONS, 
	SET_BACKUP_INTERVAL, 
	SET_SEDLOGIN_USERNAME,
	SET_USER_DATA
	} from '../Constants/ActionTypes';

import { emptyUser } from '../Constants/DefaultObjects';

export function setOutlineQuestions(usePaper) {
	return { type: SET_OUTLINE_QUESTIONS, useOutlineQuestions: usePaper }
  }

export function setBackupInterval(seconds) {
	return { type: SET_BACKUP_INTERVAL, intervalInSeconds: seconds }
  }

export function setSedLoginUsername(newSedLoginUsername) {
	return { type: SET_SEDLOGIN_USERNAME, newSedLoginUsername: newSedLoginUsername }
  }
  
export function setUserData(user) {
	console.log(user);
	return { type: SET_USER_DATA, user}
  }

export function makeNewUser(username) {
	let newUser = _.cloneDeep(emptyUser);
	newUser.username = username;
	newUser.dateModified = new Date();
	return setUserData(newUser)		
}
  

  

