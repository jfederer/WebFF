import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppLayout from './Components/AppLayout';
import { styles } from './style';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter as Router,
} from 'react-router-dom'
class App extends React.Component {

  render() {  
	const { classes, theme } = this.props;

    return (
		<React.Fragment>
		<CssBaseline />
		<Router>
		<AppLayout />

		</Router>

		</React.Fragment>
    );
  }
}

App.propTypes = {
  
};

export default withStyles(styles, { withTheme: true })(App);