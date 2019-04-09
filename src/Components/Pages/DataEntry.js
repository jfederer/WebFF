import React from 'react';
import { connect } from 'react-redux';

import { styles } from '../../style';
import { withStyles } from '@material-ui/core/styles';

import { setAppBarText } from '../../Actions/UI';

class DataEntry extends React.Component {

	constructor(props) {
		super(props);
		this.props.setAppBarText("SedFF → Data Entry");
	}

    render() {

        return (
            <div>
              DataEntry Page!!
            </div>
        );
    }
}

const mapDispatchToProps = {
	setAppBarText
}

export default withStyles(styles, { withTheme: true })
	(connect(null, mapDispatchToProps)
		(DataEntry)
	);