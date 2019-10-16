import React from 'react';

import { styles } from '../../style';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SetSummary from './SetSummary';
import KVPair from './KVPair';
import { DATA_ENTRY_INFORMATION_IDENTIFIER } from '../../Constants/Config';
import { getQuestionValue } from '../../Utils/QuestionUtilities';
import {  getQuestionDataFromID } from '../../Utils/StoreUtilities';

class DataEntrySummary extends React.Component {

	render() {
		const { classes, eventID, DE_QID } = this.props;
		if (!eventID) {
			return <Typography>Set Summary event ID unavailable</Typography>;
		}
		if (!DE_QID) {
			return <Typography>Set Summary question ID unavailable</Typography>;
		}

		let DEpanel = [];
		let SetList = [];
		let DEquestionData = getQuestionDataFromID(eventID, DE_QID);
		let DEquestionValues = getQuestionValue(eventID, DE_QID);

		Object.keys(DEquestionValues).forEach(QID => {
			// console.log('QID :', QID);
			if (QID.startsWith(DATA_ENTRY_INFORMATION_IDENTIFIER)) {
				// then this is a set
				let QD = getQuestionDataFromID(eventID, QID);

				let QV = getQuestionValue(eventID, DE_QID, QID);

				SetList.push(<SetSummary key={"SetSummary:" + QD.id} questionData={QD} questionValues={QV} />);

			} else {
				DEpanel.push(
					<KVPair key={"DELabelValuePair_" + QID}
						label={DEquestionData[QID].label}
						value={getQuestionValue(eventID, DE_QID, QID)} />
						
				);
				DEpanel.push(<br key={"DELabelValuePair_BR_" + QID} />);
			}


		})

		return DEpanel.concat(SetList);
	}
}

DataEntrySummary.propTypes = {
	eventID: PropTypes.string.isRequired,
	DE_QID: PropTypes.string.isRequired
};

export default (withStyles(styles, { withTheme: true })(DataEntrySummary));