import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';

class Parameters extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Parameters");
	}

    render() {
		const {
			currentEvent
		} = this.props;

		if (!currentEvent) {
			console.log("No current event, redirecting to dashboard"); 
			return <Redirect to = '/' />
		}

        return (
            <div>
              Parameters Page!!
            </div>
        );
    }
}

const mapStateToProps = function (state) {
	return {
		currentEvent: state.SamplingEvents[state.SedFF.currentSamplingEventID]
	}
}

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Parameters));