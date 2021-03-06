import _ from 'lodash';

import {
	SET_OUTLINE_QUESTIONS,
	SET_BACKUP_INTERVAL,
	SET_SEDLOGIN_USERNAME,
	SET_USER_DATA,
	REGISTER_EVENT_TEMPLATE_WITH_USERNAME,
	REMOVE_EVENT_TEMPLATE_FROM_USERNAME
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
	return { type: SET_USER_DATA, user }
}

export function makeNewUser(username) {
	let newUser = _.cloneDeep(emptyUser);
	newUser.username = username;
	newUser.dateModified = new Date().toString();
	newUser.sedLoginUsername = username;
	return setUserData(newUser)
}

export function userDataIngest(userData) {
	return (dispatch) => {
		//TODO: ensure userdata is of appropriate format
		dispatch({ type: SET_USER_DATA, user: userData })
		return true;
	}
}

export function registerEventTemplateWithUser(eventTemplateID, username) {
	if (!username) {
		throw new Error("No username passed to RegisterEventTemplateWithUser function");
	}
	if (!eventTemplateID) {
		throw new Error("No eventTemplateID passed to RegisterEventTemplateWithUser function");
	}

	return { type: REGISTER_EVENT_TEMPLATE_WITH_USERNAME, eventTemplateID, username };
}

export function removeEventTemplateFromUser(eventTemplateIDToRemove, username) {
	if (!username) {
		throw new Error("No username passed to removeEventTemplateFromUser function");
	}
	if (!eventTemplateIDToRemove) {
		throw new Error("No eventTemplateID passed to removeEventTemplateFromUser function");
	}

	return { type: REMOVE_EVENT_TEMPLATE_FROM_USERNAME, eventTemplateIDToRemove, username };
}
