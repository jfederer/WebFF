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
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		dialogQuestions: this.props.dialogQuestions;
	// 	};
	// };
	
	dialogSubmitHandler(dialogName, globalState) {
		alert("dialogName: " +  dialogName);
		switch (dialogName) {
			case "Switch User" : {  //HARDCODE
				//FIXME:  no value is being stored in the questions state for some reason
				// console.log(this);
				// console.log(this.refs);
				// console.log(this.refs.switchUser_email);
				// console.log(this.props.dialogQuestions);
				let username = document.getElementById('switchUser_email').value;  // KLUDGE
				this.props.setLoggedInUser(username);
				this.props.closeHandler();
				break;
			}
			default: {
				console.log(dialogName + "submit button is not yet implemented");
			}
		}
	
	}


	render() {
		const { closeHandler, dialogName, dialogDescription, dialogQuestions } = this.props;

		//TODO: callback function for these questions
		//TODO: questionPanel could actually be a questionPage...allowing for multiple panels... perhaps useful in the 'settings' dialog?


		return (
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
						questions={createQuestionComponentsForLayoutGroup(dialogQuestions, this.props.stateChangeHandler, this.props.globalState)}
						
						key={dialogName}/>
						
					</DialogContent>
					<DialogActions>
						<Button onClick={closeHandler} color="primary">Cancel</Button>
						<Button onClick={() => this.dialogSubmitHandler(dialogName, this.props.globalState)} color="primary">Submit</Button>
					</DialogActions>
				</Dialog>
		);
	}
}




SystemDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	dialogQuestions: PropTypes.array.isRequired,
	dialogDescription: PropTypes.string,
	dialogName: PropTypes.string.isRequired,
	closeHandler: PropTypes.func.isRequired
}

export default withStyles(styles)(SystemDialog);