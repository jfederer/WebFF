import { createStore, applyMiddleware, compose } from 'redux';
import RootReducer from './Reducers/RootReducer';
import thunk from 'redux-thunk';
import { loadState, saveState } from './Utils/LocalStorage';
import throttle from 'lodash.throttle';

const persistedState = loadState();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	RootReducer,
	persistedState,
	composeEnhancer(applyMiddleware(thunk))
);

store.subscribe(throttle(() => {
	saveState(store.getState())
}, 1000));

export default store;