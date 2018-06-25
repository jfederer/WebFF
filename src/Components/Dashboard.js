import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB('SedWE Dashboard');
	}

	render() {

		return (
			<h1>Dashboard</h1>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Dashboard);