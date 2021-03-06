import {baseSpacing} from './Constants/Config';

const drawerWidth = 180;


export const styles = theme => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
	},
	lightGrey: {
		backgroundColor: '#ddd'
	},
	templateValue: {
		fontSize:'75%',
		marginLeft: 10,
		// backgroundColor: '#ef0'
	},
	templateKey: {
		marginLeft: 10,
		// backgroundColor: '#f00',
		fontWeight: "500"
	},
	templateValueGrid: {
		backgroundColor: '#ddd'
	},
	hundredWidth: {
		// margin: 0,
		// padding: 0,
		width: "100%"
	},
	eightyWidth: {
		width: '80%'
	},
	horzCenterElement: {
		margin: "auto",
		backgroundolor: "red"
	},
	horzCenterText: {
		textAlign: "center"
	},
	inline: {
		display: 'inline',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: baseSpacing * 7,
		[theme.breakpoints.up('sm')]: {
			width: baseSpacing * 20,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	rightJustify: {
		position: 'absolute',
		right: '0px',
		marginLeft: 36,
		marginRight: 12,
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: baseSpacing * 3,
	},
	errorPage: {
		margin: '0 auto',
		maxWidth: '864px',
		textAlign: 'center'
	},
	formControl: {
		margin: baseSpacing,
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: baseSpacing * 2,
	},
	settingsTextField: {
		marginLeft: "16px",
	},
	dashboardWidgetTitleText: {
		color: "#222",
		minHeight: "64px",
		paddingLeft: "24px",
		paddingRight: "24px",
		fontSize: "1.25rem",
		fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
		fontWeight: 500,
		lineHeight: 1.6,
		letterSpacing: "0.0075em",
		display: "flex",
		position: "relative",
		alignItems: "center"
	},
	dashboardWidgetButton: {
		margin: "12px"
	},
	dashboardWidget: {
		minWidth: "500px"
	}
});
