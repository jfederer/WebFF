import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
import SedFF from './Components/SedFF';
// import { styles } from './style';
// import 'typeface-roboto';
// import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter as Router
} from 'react-router-dom'

class App extends React.Component {

	render() {
		return (
			<React.Fragment>
				{/* <CssBaseline /> */}
				{/* <Router> */}
					<SedFF />
				{/* </Router> */}
			
			</React.Fragment>

		);
	}
}

export default (App); 


// export default connect(withStyles(styles, { withTheme: true })) (App);



// simpleAction = (event) => {
// 	this.props.simpleAction();
//    }
//    <button onClick={this.simpleAction}>Test redux action</button>
//    <pre>
// {
// JSON.stringify(this.props)
// }
// </pre>