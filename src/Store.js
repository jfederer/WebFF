import { createStore, applyMiddleware, compose } from 'redux';
import RootReducer from './Reducers/RootReducer';
import thunk from 'redux-thunk';

const initialState = {};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	RootReducer, 
	initialState, 
	composeEnhancer(applyMiddleware(thunk))
);

export default store;