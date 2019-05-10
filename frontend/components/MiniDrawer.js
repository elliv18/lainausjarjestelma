import React from 'react';
import PropTypes from 'prop-types';
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
    display: 'flex',
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
    marginRight: 36,
    
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
    padding: theme.spacing.unit * 3,
  },
  paper: {
    marginTop: '64px',
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
  menuIcon:{
    display: 'block',
    float: 'left',
    marginLeft: '-4px',
    verticalAlign: 'center',
    textAlign: 'center',
  },
  titleText:{
      fontSize: '24px',
      margin: '2px',
      padding: '9px',
  }
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
        <AppBar position="fixed">
            <Toolbar>
                <Link href="/">
                    <Typography className={classes.titleTypo}>
                        <Button size="Large" className={classes.titleText}>Loan System</Button>
                    </Typography>
                </Link>
                <Button className={classes.myAccount} color="inherit" >
                    <Group className={classes.group}>
                    </Group> My account
                </Button>
            </Toolbar>
        </AppBar>
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
              <ListItem button key ="Equipments" className={classes.menuButton}>
                <ListItemIcon className={classes.menuIcon}><DevicesIcon /></ListItemIcon>
                <ListItemText primary="Equipments" />
              </ListItem>
              </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
                <div>{children}</div>
        </main>
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  content: PropTypes.element.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);