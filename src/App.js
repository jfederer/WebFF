import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import WebFF from './Components/WebFF';
import { styles } from './style';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter
} from 'react-router-dom';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';
import store from './Store';

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