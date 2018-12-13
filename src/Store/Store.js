import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers/RootReducer';

// export default function configureStore(initialState = {}) {
// 	return createStore(
// 		rootReducer,
// 		applyMiddleware(thunk)
// 	);
// }

import configStore from './store/configStore';

const initialReduxStoreConfig = {
    unit: 'm2',
    language: 'en'
}

const store = configStore(initialReduxStoreConfig);

export default store;