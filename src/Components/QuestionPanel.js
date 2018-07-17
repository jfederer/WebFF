import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

	  	{questions}
        <Typography variant="headline" component="h3">
          This is a sheet of paper.
        </Typography>
        <Typography component="p">
          Paper can be used to build surface or other elements for your application.
        </Typography>
      </Paper>
		);
	}
}

QuestionPanel.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuestionPanel);