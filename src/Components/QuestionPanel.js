import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';

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

		let gridedQuestions = questions.map((question) => {
			// console.log(question.props.label, " props.width_xs ", question.props.width_xs);
			// console.log(question.props.label, "props.width_lg ", question.props.width_lg);
			
			if (!question.props.hidden)
				if ((question.props.width_xs === '' || question.props.width_xs == null) && (question.props.width_lg === '' || question.props.width_lg == null)) {
					// neither lg or xs are set.
					return <Grid item
						key={question.props.id + '_grid'} xs lg>
						{question}
					</Grid>

				} else if (question.props.width_xs === '' || question.props.width_xs == null) {
					// xs is not set
					return <Grid item
						key={question.props.id + '_grid'} xs lg={question.props.width_lg}>
						{question}
					</Grid>

				} else if (question.props.width_lg === '' || question.props.width_lg == null) {
					// lg is not set
					return <Grid item
						key={question.props.id + '_grid'} xs={question.props.width_xs} lg>
						{question}
					</Grid>

				} else {
					// both lg and xs are set.
					return <Grid item
						key={question.props.id + '_grid'} xs={question.props.width_xs} lg={question.props.width_lg}
					>
						{question}
					</Grid>
				}
				//TOOD throw error, shouldn't get here.
				return null;
			}
		);

		return (
			<Paper className={classNames(classes.root, this.props.grey ? classes.lightGrey : '')} elevation={2}>
				{this.props.panelName}
				<Grid
					container
					spacing={8}
					alignItems='baseline'
					alignContent='center'
					// justify='space-around' 
					justify="center"
				>
					{gridedQuestions}
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