import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import { styles } from '../style';

class EDI extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("EDI");
	}

	render() {

		return (
			<div>
				<h1>EDI</h1>
			</div>
		);
	}
}




EDI.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(EDI);