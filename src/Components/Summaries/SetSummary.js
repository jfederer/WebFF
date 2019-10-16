import React from 'react';

import { styles } from '../../style';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SummaryTable from './SummaryTable';
import KVPair from './KVPair';


class SetSummary extends React.Component {

	render() {
		const { classes, questionData, questionValues } = this.props;

		let sampleTable = null;
		let KVPairs = [];

		if (!questionData) {
			return <Typography>Set Summary question data unavailable</Typography>;
		}
		if (!questionValues) {
			return <Typography>Set Summary question values unavailable</Typography>;
		}

 

		Object.keys(questionValues).forEach(QID => {
			//TODO: add in a special setup for the analizd for_
			if (QID.startsWith("samplesTable_")) {
				sampleTable = <SummaryTable key={questionData.id+QID} tableData={questionData[QID]} tableValue={questionValues[QID]}/>
			} else {
				let value = questionValues[QID];
				let cleanValue = value;
				if (questionData[QID].id.startsWith("analysedFor_")) {
					cleanValue = Object.keys(value).map(key => value[key] ? key : null).filter(el=>el).join(", ");
				}

				KVPairs.push(<KVPair key={questionData.id+QID} label={questionData[QID].label} value={cleanValue} />);
				KVPairs.push(<br key={"break"+questionData.id+QID}/>);
			}
		});

		return (<Paper>
			<Typography variant="h5">{"Set " + questionData.setName} </Typography>
			{KVPairs}
			{sampleTable}
		</Paper>
		)
	}
}

SetSummary.propTypes = {
	questionData: PropTypes.object.isRequired,
	questionValues: PropTypes.object.isRequired
};

export default (withStyles(styles, { withTheme: true })(SetSummary));