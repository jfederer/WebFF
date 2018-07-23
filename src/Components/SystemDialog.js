import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import QuestionPanel from './QuestionPanel';

import { createQuestionComponentsForLayoutGroup } from '../Utils/QuestionUtilities';

const styles = theme => ({

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
		const { closeHandler, dialogName, dialogDescription, dialogQuestionsInfo } = this.props;

		//TODO: callback function for these questions
		//TODO: questionPanel could actually be a questionPage...allowing for multiple panels... perhaps useful in the 'settings' dialog?


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
						<QuestionPanel 
						questions={createQuestionComponentsForLayoutGroup(dialogQuestionsInfo, null)}
						key={dialogName}/>
					</DialogContent>
					<DialogActions>
						<Button onClick={closeHandler} color="primary">Cancel</Button>
						<Button onClick={() => alert("Submitted")} color="primary">Submit</Button>
					</DialogActions>
				</Dialog>
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