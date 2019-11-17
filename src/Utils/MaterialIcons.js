import React from 'react';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import OpacityIcon from '@material-ui/icons/Opacity';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReorderIcon from '@material-ui/icons/Reorder';
import ColorizeIcon from '@material-ui/icons/Colorize';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import StraightenIcon from '@material-ui/icons/Straighten';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import CodeIcon from '@material-ui/icons/Code';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/PersonAdd';
import CompareIcon from '@material-ui/icons/Compare';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import BuildIcon from '@material-ui/icons/Build';
import SyncIcon from '@material-ui/icons/Sync';


export const materialIconBuilder = (iconName) => {
	switch (iconName) {
		case 'DashboardIcon': return <DashboardIcon />
		case 'SyncIcon': return <SyncIcon />
		case 'BuildIcon': return <BuildIcon />
		case 'HelpIcon': return <HelpIcon />
		case 'SettingsIcon': return <SettingsIcon />
		case 'InfoIcon': return <InfoIcon />
		case 'PermIdentityIcon': return <PermIdentityIcon />
		case 'ChevronRightIcon': return <ChevronRightIcon />
		case 'ImportContactsIcon': return <ImportContactsIcon />
		case 'OpacityIcon': return <OpacityIcon />
		case 'ReorderIcon': return <ReorderIcon />
		case 'ColorizeIcon': return <ColorizeIcon />
		case 'FilterDramaIcon': return <FilterDramaIcon />
		case 'StraightenIcon': return <StraightenIcon />
		case 'LibraryAddIcon': return <LibraryAddIcon />
		case 'PlaylistAddIcon': return <PlaylistAddIcon />
		case 'PersonAddIcon': return <PersonAddIcon />
		case 'GroupAddIcon': return <GroupAddIcon />
		case 'PlaylistAddCheckIcon': return <PlaylistAddCheckIcon />
		case 'NoteAddIcon': return <NoteAddIcon />
		case 'EditIcon': return <EditIcon />
		case 'CompareIcon': return <CompareIcon />
		case 'SaveIcon': return <SaveIcon />
		case 'SubtitlesIcon': return <SubtitlesIcon />
		case 'AssignmentIcon': return <AssignmentIcon />
		case 'CodeIcon': return <CodeIcon />
		case 'ChevronLeftIcon': return <ChevronLeftIcon />

		//FUTURE: additional good ones:  blur*, edit* (gives editor options...)
		default: return <SettingsInputComponentIcon />
	}
}

export const ICONS = <React.Fragment><DashboardIcon />
	<SyncIcon />
	<BuildIcon />
	<HelpIcon />
	<SettingsIcon />
	<InfoIcon />
	<PermIdentityIcon />
	<ChevronRightIcon />
	<ImportContactsIcon />
	<OpacityIcon />
	<ReorderIcon />
	<ColorizeIcon />
	<FilterDramaIcon />
	<StraightenIcon />
	<LibraryAddIcon />
	<PlaylistAddIcon />
	<PersonAddIcon />
	<GroupAddIcon />
	<PlaylistAddCheckIcon />
	<NoteAddIcon />
	<EditIcon />
	<CompareIcon />
	<SaveIcon />
	<SubtitlesIcon />
	<AssignmentIcon />
	<CodeIcon />
	<ChevronLeftIcon />
</React.Fragment>