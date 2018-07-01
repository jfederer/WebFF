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
			<div>
				<p>Collect the following data (more?)</p>
				<ul>
					<li><b>Time</b></li>
					<li><b>Location</b></li>
					<li><b>Temp</b></li>
					<li><b>Specific Conductance</b></li>
					<li><b>Transparency</b></li>
					<li><b>Trubidity (FNU)</b></li>
					<li><b>Trubidity (NTRU)</b></li>
				</ul>
			</div>
		);
	}
}




WaterQuality.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(WaterQuality);