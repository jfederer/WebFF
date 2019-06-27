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


const mapStateToProps = function (state) {
	return {
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText,
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(DataEntry));