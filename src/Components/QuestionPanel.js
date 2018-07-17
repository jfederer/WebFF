import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	root: {
	  ...theme.mixins.gutters(),
	  paddingTop: theme.spacing.unit * 2,
	  paddingBottom: theme.spacing.unit * 2,
	},
  });

class QuestionPanel extends React.Component {
	render() {
		const { classes } = this.props;
		const { questions } = this.props;
	
		return (
      <Paper className={classes.root} elevation={1}>
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
};

export default withStyles(styles)(QuestionPanel);