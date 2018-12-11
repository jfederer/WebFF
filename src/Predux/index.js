import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import configureStore from './Store';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<SimpleSelect />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
ReactDOM.render(
    <Provider store={configureStore()}>
     <App />
    </Provider>,
    document.getElementById('root')
   );
   registerServiceWorker();