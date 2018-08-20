import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import QuestionPanel from './QuestionPanel';
import { createQuestionComponents, 
	getLayoutGroupNames, getLayoutGroupQuestionsData } from '../Utils/QuestionUtilities';


// standardize (library?) the use of "questionsData" string to generalized variable

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing.unit * 2,
	},
});



class QuestionPage extends React.Component {

	componentWillMount() {
		this.props.appBarTextCB(this.props.tabName);
	}

	componentWillUpdate(nextProps, nextState) { // gets called when moving between pages
		this.props.appBarTextCB(nextProps.tabName);
	}

	render() {
		const DEBUG = false;
		const { tabName, questionsData, systemCB, hiddenPanels} = this.props;
		let tabQuestionData = [];
		let layoutGroupNames = [];
		let questionPanels = [];
		if (DEBUG) console.log("Question Page Render:  props:  ", this.props);
		if (DEBUG) console.log("Question Page Render:  hiddenPanels:  ", hiddenPanels);


		if (questionsData.length > 0) {

			tabQuestionData = questionsData.filter((question) => {
				if(question.tabName) {
					return question.tabName.replace(/ /g,'') === tabName.replace(/ /g,'');  //regex removes whitespace... allowing a match regardless of whitespace in the url or the questions database
				} else {
					return false;
				}
			});

			layoutGroupNames = getLayoutGroupNames(tabQuestionData);
	
			layoutGroupNames = layoutGroupNames.filter((groupName) => {
				return !hiddenPanels.includes(tabName.replace(/ /g,'')+":"+groupName.replace(/ /g,'')) && !hiddenPanels.includes(tabName+":"+groupName); 
			})
				
			for(let i = 0; layoutGroupNames !== null && i < layoutGroupNames.length; i++) {
				let layoutGroupQuestionsData = getLayoutGroupQuestionsData(tabQuestionData, layoutGroupNames[i]);

				questionPanels.push(
				<div key={tabName + layoutGroupNames[i] + '_div'}>
					<QuestionPanel 
						questions={createQuestionComponents(layoutGroupQuestionsData, systemCB, this.props.globalState, this.props.questionsValues, this.props)} 
						panelName={layoutGroupNames[i]}
						key={tabName + layoutGroupNames[i]}
						grey={i%2===1} />
						<Divider />
						</div>
						);
			}
		}

		return (
			<div>
				{this.props.tabName}
				{questionPanels}
			</div>
		);
	}
}

QuestionPage.propTypes = {
	classes: PropTypes.object.isRequired,
	appBarTextCB: PropTypes.func.isRequired,
	tabName: PropTypes.string.isRequired,
	questionsData: PropTypes.array.isRequired,
	hiddenPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
	systemCB: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(QuestionPage));