import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import QuestionPanel from './QuestionPanel';

class WaterQuality extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("Water Quality");
	}

	render() {
		return (
			<div>
				<QuestionPanel>
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
				</QuestionPanel>
			</div>
		);
	}
}




WaterQuality.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(WaterQuality);