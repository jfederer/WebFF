import { ADD_ARTICLE } from "../Constants/ActionTypes";

export const addArticle = article => {
	return { type: ADD_ARTICLE, payload: article };
}