import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import WebFF from './Components/WebFF';
import { styles } from './style';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
	BrowserRouter as Router
} from 'react-router-dom'
import { connect } from 'react-redux';
import { SimpleAction } from './Actions/SimpleAction'

const mapStateToProps = state => ({
	...state
   })

   const mapDispatchToProps = dispatch => ({
	simpleAction: () => dispatch(SimpleAction())
   })
   

class App extends React.Component {

	render() {
		return (
			<React.Fragment>
				<CssBaseline />
				<Router>
					<WebFF />
				</Router>
			
			</React.Fragment>

		);
	}
}


export default connect(mapStateToProps, mapDispatchToProps) (App); 
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