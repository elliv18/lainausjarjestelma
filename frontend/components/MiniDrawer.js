import React from 'react';
import PropTypes from 'prop-types';
import App from '../components/App';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Group from '@material-ui/icons/Group'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DevicesIcon from '@material-ui/icons/Devices';
import Link from 'next/link'


const drawerWidth = 240;

const styles = theme => ({
  root: {
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    
  },
  appBarShift: {
    margin: 0,
    width: '100%',
    
  },
  menuButton: {
    marginLeft: 12,
    
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    top: '64px',
    overflowY: 'auto',
    left: 0,
  },
  paper: {
    top: '64px',
    overflow: 'auto',
    left: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: '16px'
    },
  myAccount:{
    right: 0,
  },
  group:{
    marginRight: 10,
  },
  titleTypo:{
    flexGrow: 1,
  },
  titleText:{
      fontSize: '24px',
      margin: '2px',
      padding: '9px',
  },
  menuIcon:{
    marginLeft: '8px',
  },
  paperDrawerClose: {
    paddingLeft: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 9 + 1,
    },
    width: '100%',
    transition: 'padding-left 0.4s',
  },
  paperDrawerOpen: {
    paddingLeft: drawerWidth,
    width: '100%',
    transition: 'padding-left 0.4s',
  },

});

class MiniDrawer extends React.Component {
    constructor(props){
        super(props)
    }
    state = {
        open: false,
    };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { children, classes, theme } = this.props;


    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="sticky">
            <Toolbar>
                <Link href="/">
                    <Typography className={classes.titleTypo}>
                        <Button size="large" className={classes.titleText}>Loan System</Button>
                    </Typography>
                </Link>
                <Button className={classes.myAccount} color="inherit" >
                    <Group className={classes.group}>
                    </Group> My account
                </Button>
            </Toolbar>
        </AppBar>
        <App>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames(classes.paper, {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <List>
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, {
                    [classes.hide]: this.state.open,
                })}
                >
                <MenuIcon />
            </IconButton>
            <IconButton onClick={this.handleDrawerClose}
                className={classNames(classes.menuButton, {
                    [classes.hide]: !this.state.open,
                })}>
                <ChevronLeftIcon />
            </IconButton>
          </List>
          <Divider/>
          <List>
              <Link href="/equipments">
              <ListItem button key ="Equipments">
                <ListItemIcon className={classes.menuIcon}><DevicesIcon /></ListItemIcon>
                <ListItemText primary="Equipments" />
              </ListItem>
              </Link>
          </List>
        </Drawer>
          <div className={classNames({
            [classes.paperDrawerOpen]: this.state.open,
            [classes.paperDrawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames(classes.paper, {
              [classes.paperDrawerOpen]: this.state.open,
              [classes.paperDrawerClose]: !this.state.open,
            }),
          }}>
            {children}
          </div>
        </App>
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);