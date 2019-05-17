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
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DevicesIcon from '@material-ui/icons/Devices';
import Link from 'next/link'
//import {JWT} from '../lib/environment'
import Router from'next/router'
import redirect from '../lib/redirect';
import jwt from 'jwt-decode';


const drawerWidth = 240;

const styles = theme => ({
  root: {
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(0,70,85,0.85)',
    
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
      color: 'white',
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

  state = {
    open: false,
    ok: false,
};
   
  async componentDidMount(){
    try{
      const JWT = localStorage.getItem('jwtToken')
      await jwt(JWT)

      this.setLoginOk()
    } catch (e){
      console.log('catch error mini')
      Router.push({
        pathname: '/login',
      });
    }
  }

  setLoginOk = () => {
    this.setState({ok: true })
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  
  

  render (){

    
    
    const { children, classes, theme } = this.props;
  
    if(this.state.ok){
    return (
      <div className={classes.root}>
      
        <CssBaseline />
        <AppBar position="sticky" className={classes.appBar}>
            <Toolbar>
                <Link href="/">
                    <Typography className={classes.titleTypo}>
                        <Button size="large" className={classes.titleText}>Loan System</Button>
                    </Typography>
                </Link>
                <Button className={classes.myAccount} color="inherit" >
                    <AccountCircle className={classes.group}>
                    </AccountCircle> My account
                </Button>
                <Button className={classes.myAccount} color="inherit" 
                onClick={()=>
                  localStorage.removeItem('jwtToken',
                  Router.push({
                  pathname: '/login'
                })
                )}
                >
                <LogoutIcon className={classes.group}/> Logout
             
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
    )
        } else {
          return null
        }
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);