import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
	root: { // applies to entire QuestionPanel
		// ...theme.mixins.gutters(),
		flexGrow: 1,
		  paddingTop: theme.spacing.unit * 1,
		  paddingBottom: theme.spacing.unit * 1,
			backgroundColor: 'white',
			margin: '10px',  //margin between QuestionPanels
			[theme.breakpoints.down('sm')]: {
			  backgroundColor: theme.palette.secondary.main,
			},
			[theme.breakpoints.up('md')]: {
			  backgroundColor: theme.palette.primary.main,
			},
			[theme.breakpoints.up('lg')]: {
			  backgroundColor: green[500],
			},
	},
	lightGrey: {
		backgroundColor: '#eee'
	}
});

class QuestionPanel extends React.Component {
	render() {
		const { classes } = this.props;
		const { questions } = this.props;

		return (
			<Paper className={classNames(classes.root, this.props.grey ? classes.lightGrey : '')} elevation={2}>
				{this.props.panelName}
				<Grid 
					container 
					spacing={8}
					alignItems='baseline'
					justify='space-around' 
					>
					{questions}  
					{/* Note, The 'questions' are encased in Grid items. */}
				</Grid>
			</Paper>
		);
	}
}

QuestionPanel.propTypes = {
	classes: PropTypes.object.isRequired,
	questions: PropTypes.array.isRequired,
	grey: PropTypes.bool
}

export default withStyles(styles)(QuestionPanel);