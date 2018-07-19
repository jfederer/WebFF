import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { createQuestionComponentsForLayoutGroup } from '../Utils/QuestionUtilities';

const styles = theme => ({
	root: {
		backgroundColor: "#991"
	},

});

class SystemDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogQuestionsInfo: []
		};
		//this.questionChangeHandler = this.questionChangeHandler.bind(this);
	}



	render() {
		const { classes, closeHandler, dialogName, dialogDescription, dialogQuestionsInfo } = this.props;

		//TODO: callback function for these questions

		return (
			<div>

				<Dialog
					open={this.props.isOpen}
					onClose={this.props.closeHandler}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">{dialogName}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{dialogDescription}:
            			</DialogContentText>
						<TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              fullWidth
            />
						{createQuestionComponentsForLayoutGroup(dialogQuestionsInfo, null)}
					</DialogContent>
					<DialogActions>
						<Button onClick={closeHandler} color="primary">Cancel</Button>
						<Button onClick={() => alert("Submitted")} color="primary">Submit</Button>
					</DialogActions>
				</Dialog>



				{/* <Paper className={classNames(classes.root, this.props.grey ? classes.lightGrey : '')} elevation={2}>
				{this.props.panelName}
				<Grid 
					container 
					spacing={8}
					alignItems='baseline'
					justify='space-around' 
					>
					{questions}  
					{/* Note, The 'questions' are encased in Grid items. */}
				{/* </Grid>
			</Paper> */} */}
			</div>
		);
	}
}

SystemDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	dialogQuestionsInfo: PropTypes.array.isRequired,
	dialogDescription: PropTypes.string,
	dialogName: PropTypes.string.isRequired,
	closeHandler: PropTypes.func.isRequired
}

export default withStyles(styles)(SystemDialog);