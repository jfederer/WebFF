import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';
import { PARAMETER_TABLE_TYPE } from '../../Constants/Config';

import { SEQuestionValueChange } from '../../Actions/SamplingEvents';
import TabbedPage from './TabbedPage';


class Parameters extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Parameters");
	}


	render() {
		const {
			currentEvent,
		} = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard");
			return <Redirect to='/' />
		}

		return (<React.Fragment>
			<TabbedPage componentType={PARAMETER_TABLE_TYPE} />
		</React.Fragment >
		);
	}
}


const mapStateToProps = function (state) {
	return {
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID],
	}
}


const mapDispatchToProps = {
	setAppBarText,
	SEQuestionValueChange
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Parameters));