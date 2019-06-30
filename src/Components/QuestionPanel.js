import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import { getGridedQuestions } from './../Utils/QuestionUtilities';

const styles = theme => ({
	root: { // applies to entire QuestionPanel
		...theme.mixins.gutters(),
		flexGrow: 1,
		paddingTop: 0,
		paddingBottom: 0,
		backgroundColor: '#eee',
		margin: '10px',  //margin between QuestionPanels
		[theme.breakpoints.down('sm')]: {  // can be deleted, here for helping with layout testing
			backgroundColor: '#eee',
		},
		[theme.breakpoints.up('lg')]: {
			backgroundColor: '#eee',
		},
	},
	lightGrey: {
		backgroundColor: '#ddd'
	}
});

class QuestionPanel extends React.Component {
	render() {
		const { classes } = this.props;
		const { questions } = this.props;

		return (
			<Paper className={classNames(classes.root, this.props.grey ? classes.lightGrey : '')} elevation={2}>
				{this.props.panelName}
				{getGridedQuestions(questions)}
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