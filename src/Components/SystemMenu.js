import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import 'typeface-roboto';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
// import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import BuildIcon from '@material-ui/icons/Build';
import SyncIcon from '@material-ui/icons/Sync';
import CodeIcon from '@material-ui/icons/Code';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { Link } from 'react-router-dom';
import { PROGRAM_VERSION } from '../Utils/Constants';
import { systemMenuItemClicked } from '../Actions/UI';
import { connect } from 'react-redux';

const styles = {
  list: {
    width: 'auto',
  },
  noUnderline: {
    textDecoration: 'none'
  }
};




//TODO: move handler entirely to reducer


class SystemMenu extends React.Component {


	menuItemClickHandler(menuText) {


		if (menuText === "Test") {
			console.log("Starting ALL-XML-TEST");



			// this.fetchDBInfo("", '', (response) => console.log("Nothing: ", response));
			// // this.fetchDBInfo("hiddenPanels", '', (response) => console.log("hiddenPanels: ", response));
			// // this.fetchDBInfo("jfederer@usgs.gov", "users", (response) => console.log("Users Collection, jfederer: ", response));
			// // this.fetchDBInfo("", "users", (response) => console.log("Users Collection, all: ", response));

			// //this.buildCombinedQuestionsData(() => console.log("CALLBACK!!"));
			// // this.propagateQWDATAInfo();
			// //this.updateDBInfo("id","testID",{"testKeyTwo":"2"},(res)=>console.log(res));
			// //this.setShippedStatus(null, true);


			// // sort out differences in local dev server and production server calls
			// const API = PHP_FILE_LOCATION + 'test_middle.php/';
			// let query = '';

			// console.log("Testing connection: ", API, ")");


			// // if (_query !== '') {
			// // 	query = 'needleID=' + encodeURIComponent(_query);
			// // }

			// // if (_collection !== '') {
			// // 	if (query !== '') {
			// // 		query += '&';
			// // 	}
			// // 	query += "collection=" + _collection;
			// // }

			// // if (isDEV) {
			// // 	const API = 'https://localhost:3004/';
			// // 	query = encodeURIComponent(_query);
			// // }

			// function handleErrors(response) {
			// 	// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			// 	if (!response.ok) {
			// 		throw Error(response.statusText);
			// 	}
			// 	//note 404 is not found and 400 is a mal-formed request
			// 	return response;
			// }

			// fetch(API, {
			// 	method: 'POST',
			// 	headers: new Headers({
			// 		'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
			// 	}),
			// 	body: query
			// })
			// 	.then(handleErrors)
			// 	.then(response => {
			// 		//console.log("RAW response: ", response);
			// 		let respT = response.text();
			// 		console.log("Response text: ", respT);

			// 		// return response.json();
			// 		return respT;
			// 	}
			// 	)
			// 	.then(parsedJSON => {
			// 		console.log("Parsed JSON: ", parsedJSON);
			// 		// // setTimeout(() => {
			// 		//successCB(parsedJSON);
			// 		// }, 1200);
			// 	})
			// 	// .catch(error => {  });
			// 	.catch(error => {
			// 		console.error("Error fetching " + API + query + "\n" + error);
			// 	}
			// 	);
		}



		if (menuText === "Save XML") {
			this.handleXMLDialogOpen();
			return;
		}
		if (menuText === "About") {
			alert("This is Sediment Field Forms (SedFF) version " + PROGRAM_VERSION + " built by jfederer@usgs.gov and kaskach@usgs.gov on Nov 14, 2018");
			return;
		}

		if (menuText === "Add/Remove Question") {
			this.handleQuestionDialogOpen();
			return;
		}


		if (menuText === "Sync Data to Database") {
			this.updateDatabase();
			return;
		}


		// actually opening dialog 
		// build the curDialogXXX data
		this.setState({ curDialogName: menuText });

		let filteredDialogInfo = this.state.dialogQuestions.filter((dialogItem) => {
			return dialogItem.dialogName.replace(/ /g, '') === menuText.replace(/ /g, '')
		});

		if (filteredDialogInfo && filteredDialogInfo.length === 1) {
			this.setState({
				curDialogDescription: filteredDialogInfo[0].dialogDescription,
				curDialogName: menuText,
				curDialogQuestions: filteredDialogInfo[0].questions
			}, () => { //open the dialog 
				this.handleDialogOpen();
			}
			);

		} else {
			//TODO: ERR
			console.log(menuText + " is not yet implemented");
		}

	}


  render() {
    const { classes } = this.props;

    const systemMenu = (
      <div className={classes.list}>
        <List>
          {/* <ListItem button onClick={() => this.props.menuItemClickHandler('Test')}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Test" />
          </ListItem> */}
          <ListItem button onClick={() => this.menuItemClickHandler('Save XML')}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary="Save XML" />
          </ListItem>

          <ListItem button onClick={() => this.menuItemClickHandler('Sync Data to Database')}>
            <ListItemIcon>
              <SyncIcon />
            </ListItemIcon>
            <ListItemText primary="Sync Data to Database" />
          </ListItem>

          <ListItem button onClick={() => this.menuItemClickHandler('Add/Remove Station')}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add/Remove Station" />
          </ListItem>

          <ListItem button onClick={() => this.menuItemClickHandler('Add/Remove Question')}>
            <ListItemIcon>
            <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Add/Remove Question" />
          </ListItem>

          <a className={classes.noUnderline} href="https://docs.google.com/document/d/15rctoHyXupM6MiDQSHd9Hfb4nxkssAXY3lI7DThjYNc/edit?usp=sharing" target="_blank">
          <ListItem button onClick={() => this.menuItemClickHandler('User Manual')}>
          {/* <ListItem button onClick={() => this.props.menuItemClickHandler('User Manual')}> */}
          
          
            <ListItemIcon>
              <ImportContactsIcon />
            </ListItemIcon>
            <ListItemText primary="User Manual" />
         
          </ListItem>
          </a>

          <ListItem button onClick={() => this.menuItemClickHandler('Settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>

          {/* <ListItem button onClick={() => this.menuItemClickHandler('About')}> */}
          <ListItem button onClick={() => this.props.dispatch(systemMenuItemClicked('About'))}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>

          <ListItem button onClick={() => this.menuItemClickHandler('Switch User')}>
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            <ListItemText primary="Switch User" /> {/* TODO: Login toggle? */}
          </ListItem>
        </List>
      </div>
    );

    return (
      <Drawer
        anchor="right"
        open={this.props.isOpen}
        onClose={this.props.closeHandler}
        ref="systemMenu">
        <div
          tabIndex={0}
          role="button"
          onClick={this.props.closeHandler}
          onKeyDown={this.props.closeHandler}
        >
          {systemMenu}
        </div>
      </Drawer>
    );
  }
}

SystemMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(null, null)(withStyles(styles)(SystemMenu));