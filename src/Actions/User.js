import { SET_OUTLINE_QUESTIONS, SET_BACKUP_INTERVAL, SET_SEDLOGIN_USERNAME } from '../Constants/ActionTypes';

export function setOutlineQuestions(usePaper) {
	return { type: SET_OUTLINE_QUESTIONS, useOutlineQuestions: usePaper }
  }

export function setBackupInterval(seconds) {
	return { type: SET_BACKUP_INTERVAL, intervalInSeconds: seconds }
  }

export function setSedLoginUsername(newSedLoginUsername) {
	return { type: SET_SEDLOGIN_USERNAME, newSedLoginUsername: newSedLoginUsername }
  }

  

