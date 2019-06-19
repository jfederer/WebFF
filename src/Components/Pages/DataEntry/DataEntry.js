import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { styles } from '../../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../../Actions/UI';

import QuestionPage from '../../QuestionPage';
import AddSetForm from './AddSetForm';


class DataEntry extends React.Component {


	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
	}


	render() {
		const { currentEvent } = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (<React.Fragment>
			<QuestionPage tabName="Data Entry" />
			<AddSetForm />
		</React.Fragment>
		)
	}
}

/* TODO: NEXT:  react upon sampling points... no table until then */
/* TODO: NEXT: NEXT:  questions with default values need to go into sampling event */
/* TODO: NEXT: NEXT: NEXT:  Hide options until samp method and sed type selected */
/* TODO: NEXT: NEXT: NEXT: NEXT: sediment type should be passed to the DE page as prop, not saved in event (or something similar) to facilitate multiple DE pages */


const mapStateToProps = function (state) {
	return {
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText,
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));