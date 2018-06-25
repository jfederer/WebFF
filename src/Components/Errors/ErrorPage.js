import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../style';
import waterError from '../../Images/Error_water.png';

class ErrorPage extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("Route Not Found");
	}
	
	render() {
		const { classes, errMsg, appBarTextCB } = this.props;
		console.log(this.props);
		

		return (
			<div className={classes.errorPage}>
			<img src={waterError} alt="Error Image"/><br />
			<h6>{errMsg}</h6>
			</div>
		);
	}
}

ErrorPage.propTypes = { 

};

export default withStyles(styles)(ErrorPage);