import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import WebFF from './Components/WebFF';
import { styles } from './style';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter as Router
} from 'react-router-dom'
class App extends React.Component {

	render() {
		return (
			<React.Fragment>
				<CssBaseline />
				<Router>
					<WebFF />
				</Router>
			</React.Fragment>
		);
	}
}


export default withStyles(styles, { withTheme: true })(App);