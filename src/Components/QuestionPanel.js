import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames'

const styles = theme => ({
	root: {
		...theme.mixins.gutters(),
		  paddingTop: theme.spacing.unit * 1,
		  paddingBottom: theme.spacing.unit * 1,
			backgroundColor: 'white',
			margin: '10px'
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
				<Grid container spacing={24}>
					{questions}
				</Grid>
			</Paper>
		);
	}
}

QuestionPanel.propTypes = {
	classes: PropTypes.object.isRequired,
	questions: PropTypes.array.isRequired
	// className={
}

export default withStyles(styles)(QuestionPanel);