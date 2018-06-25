import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { styles } from '../theme';

class Dashboard extends React.Component {
	render() {

		return (
			<h1>FF</h1>
		);
	}
}

Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired,
//    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Dashboard);