import React from 'react';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
class TextMessageDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value:this.props.initialValue?this.props.initialValue:""
		}
	}

	textChangeHandler = (e) => {
		this.setState({ value: e.target.value });
	}

	render() {
		return (
			<Dialog
				open={this.props.open}
				onClose={this.props.onClose}
				aria-labelledby="form-dialog-title"
			>
				<form className="commentForm" onSubmit={this.props.onSave}>
					<DialogTitle id="form-dialog-title">{this.props.dialogTitle}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.props.dialogText}
						</DialogContentText>
						<TextField
							autoFocus
							value={this.state.value}
							onChange={this.textChangeHandler}
							margin="dense"
							id={this.props.id}
							// label="Message To Lab"
							rows={this.props.rows ? this.props.rows : 5}
							fullWidth
							multiline
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.props.onClose} color="primary">
							Cancel
		  </Button>
						<Button onClick={()=>this.props.onSave(this.state.value)} color="primary">
							Save
		  </Button>
					</DialogActions>
				</form>
			</Dialog>

		);
	}
}

export default withStyles(styles, { withTheme: true })(TextMessageDialog);