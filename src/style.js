const drawerWidth = 180;

export const styles = theme => ({
	root: {
	  flexGrow: 1,
	  zIndex: 1,
	  overflow: 'hidden',
	  position: 'relative',
	  display: 'flex',
	},
	appBar: {
	  zIndex: theme.zIndex.drawer + 1,
	  // transition: theme.transitions.create(['width', 'margin'], {
	  //   easing: theme.transitions.easing.sharp,
	  //   duration: theme.transitions.duration.leavingScreen,
	  // }),
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
	  width: theme.spacing.unit * 7,
	  [theme.breakpoints.up('sm')]: {
		width: theme.spacing.unit * 9,
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
	  padding: theme.spacing.unit * 3,
	},
	errorPage: {
	  margin: '0 auto',
	  maxWidth: '864px',
	  textAlign: 'center'
	},
  formControl: {
	margin: theme.spacing.unit,
	minWidth: 120,
  },
  selectEmpty: {
	marginTop: theme.spacing.unit * 2,
  },
  });
