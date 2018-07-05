import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB('SedWE Dashboard');
	}

	render() {

		return (
			<div>
				<h1>Dashboard</h1>
				<p>General info and direct links to items (??? - need help here, this isn't in MN workflow)</p>
				<ul>
					<li><b>Number of unsubmitted events</b> - list with links to submit? red for ones that don't pass verification?</li>
					<li><b>Event Manager</b>Total number of events - click for more info</li>
					<li><b>Create/Start New Sampling Event</b><Link to='/FieldForm'><button onClick={()=>	{
						this.props.navControl("Water Quality",true);
						this.props.navControl("Field Form",true);
						}}>Start</button></Link></li>
					<li><b>????</b></li>
				</ul>
			</div>

		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Dashboard);