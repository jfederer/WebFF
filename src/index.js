import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';

import { Provider } from 'react-redux'
//import { createStore, applyMiddleware } from 'redux';
 import store from './Store/Store';
//import thunk from 'redux-thunk';
//import rootReducer from './Store/Reducers/RootReducer';

import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    <Provider store={configureStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();