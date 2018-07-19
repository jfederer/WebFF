import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	root: {
	  flexGrow: 1,
	},
	paper: {
	  padding: theme.spacing.unit * 2,
	  textAlign: 'center',
	  color: theme.palette.text.secondary,
	},
  });

class Dashboard extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB('SedWE Dashboard');
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
			<h1>Dashboard</h1>
			<p>General info and direct links to items (??? - need help here, this isn't in MN workflow)</p>
			<Grid container spacing={24}>
			  <Grid item xs>
				<Paper className={classes.paper}><b>Number of unsubmitted events</b> - list with links to submit? red for ones that don't pass verification?</Paper>
			  </Grid>
			  <Grid item xs>
				<Paper className={classes.paper}><b>Event Manager</b>Total number of events - click for more info</Paper>
			  </Grid>
			</Grid>
			<Grid container spacing={24}>
			  <Grid item xs>
				<Paper className={classes.paper}><b>Create/Start New Sampling Event</b><br /><Link to='/FieldForm'><Button onClick={()=>	{
						this.props.navControl("Water Quality",true);
						this.props.navControl("Field Form",true);
						}}>Start</Button></Link></Paper>
			  </Grid>
			</Grid>
		  </div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Dashboard);