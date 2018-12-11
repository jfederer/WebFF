import { ADD_ARTICLE } from "../Constants/ActionTypes";
const initialState = {
	articles: []
};
const SimpleReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_ARTICLE:
			return { ...state, articles: [...state.articles, action.payload] };
		default:
			return state;
	}
};
export default SimpleReducer;