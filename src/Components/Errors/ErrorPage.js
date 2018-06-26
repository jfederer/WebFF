import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../style';
import waterError from '../../Images/Error_water.png';

class ErrorPage extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("Route Not Found");
	}

	render() {
		const { classes, errMsg } = this.props;
//		console.log(this.props);
		

		return (
			<div className={classes.errorPage}>
			<img src={waterError} alt="Error"/><br />
			<h6>{errMsg}</h6>
			</div>
		);
	}
}

ErrorPage.propTypes = { 
	classes: PropTypes.object.isRequired,
	errMsg: PropTypes.string,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles)(ErrorPage);