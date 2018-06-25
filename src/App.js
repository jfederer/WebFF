import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppLayout from './Components/AppLayout';
import { styles } from './theme';
import 'typeface-roboto';

class App extends React.Component {

  render() {  
	const { classes, theme } = this.props;

    return (
		<AppLayout />
    );
  }
}

App.propTypes = {
  
};

export default withStyles(styles, { withTheme: true })(App);