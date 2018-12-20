import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import WebFF from './Components/WebFF';
import { styles } from './style';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter
} from 'react-router-dom';

import { Provider } from 'react-redux'
import { createStore } from 'redux';
import RootReducer from './Reducers/RootReducer';

const initialState = {};

const store = createStore(RootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());



class App extends React.Component {

	render() {
		return (
			<Provider store={store}>
				<CssBaseline />
				<BrowserRouter>
					<WebFF />
				</BrowserRouter>
			</Provider>
		);
	}
}


export default withStyles(styles, { withTheme: true })(App);