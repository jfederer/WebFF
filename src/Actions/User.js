import { SET_OUTLINE_QUESTIONS, SET_BACKUP_INTERVAL, SET_SEDLOGIN_USERNAME } from '../Constants/ActionTypes';

export function setOutlineQuestions(usePaper) {
	return { type: SET_OUTLINE_QUESTIONS, payload: usePaper }
  }

export function setBackupInterval(seconds) {
	return { type: SET_BACKUP_INTERVAL, payload: seconds }
  }

export function setSedLoginUsername(newSedLoginUsername) {
	return { type: SET_SEDLOGIN_USERNAME, payload: newSedLoginUsername }
  }

  

