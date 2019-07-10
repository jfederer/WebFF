import React from 'react';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Question from '../Question';

class MultipleChoiceDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: this.props.initialValue ? _.cloneDeep(this.props.initialValue) : {}
		}
	}

	changeHandler = (eventID, QID, value) => {
		this.setState({ value: value });
	}

	render() {
		return (
			<Dialog
				open={this.props.open}
				onClose={this.props.onClose}
				aria-labelledby="form-dialog-title"
			><form className="commentForm" onSubmit={this.props.onSave}>
					<DialogTitle id="form-dialog-title">{this.props.dialogTitle}</DialogTitle>
					{/* {this.props.open  //avoiding a render of the question
						? */}
						 < DialogContent >
						<DialogContentText>
							{this.props.dialogText}
						</DialogContentText>
						{Object.keys(this.props.options).length === 0 ?
							<Typography>{this.props.noOptionsMessage}</Typography> :
							<Question
								id={this.props.id}
								type="MultipleChoice"
								options={this.props.options}
								value={this.state.value}
								alternateChangeHandler={this.changeHandler}
							/>}
						</DialogContent>
					{/* : null } */}
					<DialogActions>
					<Button onClick={this.props.onClose} color="primary">
						Cancel
						</Button>
					<Button onClick={() => this.props.onSave(this.state.value)} color="primary">
						Save
		  				</Button>
				</DialogActions>
				</form>
			</Dialog >

		);
	}
}

export default withStyles(styles, { withTheme: true })(MultipleChoiceDialog);