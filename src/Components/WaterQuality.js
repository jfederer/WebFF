import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import { styles } from '../style';

class WaterQuality extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("Water Quality");
	}

	render() {

		return (
			<h1>WQ</h1>
		);
	}
}

WaterQuality.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(WaterQuality);