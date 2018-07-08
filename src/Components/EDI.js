import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../style';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';

const components = {
	sm: 'em',
	md: 'u',
	lg: 'del',
};

class EDI extends React.Component {
	componentDidMount() {
		this.props.appBarTextCB("EDI");
	}

	render() {
		const { classes } = this.props;
		const { width } = this.props;
		//const Component = components[width] || 'span';
		const ONES = <div>i'm just a little old oney</div>
		const TWOEY = <div><div>Probably just two</div><div>BUT WHO KNOWS</div></div>

		return (
			<div>
				<Typography variant="subheading" gutterBottom>
					Material-UI Grid:
      </Typography>
				<Grid container spacing={24}>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3</Paper>
					</Grid>
					<Grid item xs={8}>
						<Paper className={classes.paper}>xs=8</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.paper}>xs=4</Paper>
					</Grid>
				</Grid>
				<Divider className={classes.divider} />
				<Typography variant="subheading" gutterBottom>
					CSS Grid Layout:
      </Typography>
				<div className={classes.container}>
					<div style={{ gridColumnEnd: 'span 3' }}>
						<Paper className={classes.paper}>xs=3</Paper>
					</div>
					<div style={{ gridColumnEnd: 'span 3' }}>
						<Paper className={classes.paper}>xs=3</Paper>
					</div>
					<div style={{ gridColumnEnd: 'span 3' }}>
						<Paper className={classes.paper}>xs=3</Paper>
					</div>
					<div style={{ gridColumnEnd: 'span 3' }}>
						<Paper className={classes.paper}>xs=3</Paper>
					</div>
					<div style={{ gridColumnEnd: 'span 8' }}>
						<Paper className={classes.paper}>xs=8</Paper>
					</div>
					<div style={{ gridColumnEnd: 'span 4' }}>
						<Paper className={classes.paper}>xs=4</Paper>
					</div>
				</div>
				<Divider className={classes.divider} />
				<div className={classes.root}>
					<Typography variant="subheading">{'down(sm): red'}</Typography>
					<Typography variant="subheading">{'up(md): blue'}</Typography>
					<Typography variant="subheading">{'up(lg): green'}</Typography>
				</div>
				<Divider className={classes.divider} />

				<Typography variant="subheading">
					{/* <Component>{`Current width: ${width}`}</Component> */}
					<div>{width==='md' ? ONES : TWOEY}</div>
				</Typography>


			</div>
		);
	}
}

EDI.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func
};

export default withWidth()(withStyles(styles)(EDI));