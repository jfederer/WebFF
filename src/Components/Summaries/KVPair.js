import React from 'react';

import { styles } from '../../style';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';



class KVPair extends React.Component {

	render() {
		const {  label, value } = this.props;

		let safeValue = value;
		if (typeof value === 'object') {
			safeValue = JSON.stringify(value);  //TODO: cleaner object handling... stringify doesn't crash, but looks bad. Includes nulls and numbers badly (and )  special cases such as multi-choice and others should be handled by the parent.
		}

		return <React.Fragment>
			<Typography display="inline" className="summaryLabel">{label}</Typography> :
			<Typography display="inline" className="summaryValue">{safeValue.toString()}</Typography>
		</React.Fragment>
	}
}

KVPair.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired
};

export default (withStyles(styles, { withTheme: true })(KVPair));