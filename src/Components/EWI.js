import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
import { styles } from '../style';

class EWI extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("EDI");
	}

	render() {

		return (
			<div>
				<h1>EWI</h1>
			</div>
		);
	}
}


EWI.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(EWI);