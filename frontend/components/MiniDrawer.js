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

import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DevicesIcon from '@material-ui/icons/Devices';
import GroupIcon from '@material-ui/icons/Group';
import HomeIcon from '@material-ui/icons/Home';
import LoansIcon from '@material-ui/icons/ImportContacts';
import DeviceCategoriesIcon from '@material-ui/icons/DevicesOther';

import Link from 'next/link';
import Router from 'next/router';

import Cookies from 'js-cookie';

import { withApollo } from 'react-apollo';
import { CURRENTUSER } from '../lib/gql/queries';

/*********************** GLOBAL VARIABLES *************************/

const drawerWidth = 220;

/****************************** STYLES *****************************/

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(0,70,85)',
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
  drawerPaper: {
    top: '64px',
    overflow: 'auto',
    left: 0,
    backgroundColor: '#E7EEEF',
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
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: '100px',
    backgroundColor: '#B9CCD0',
    minHeight: 'calc(100vh - 64px)',
  },
  myAccount: {
    right: 0,
  },
  group: {
    marginRight: 10,
  },
  titleTypo: {
    flexGrow: 1,
    color: 'white',
    fontSize: '24px',
    textTransform: 'uppercase',
  },
  titleText: {
    color: 'white',
    fontSize: '24px',
    margin: '2px',
    padding: '9px',
  },
  menuIcon: {
    paddingLeft: '8px',
  },
  paperDrawerClose: {
    paddingLeft: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 9 + 1,
    },
    width: '100%',
    transition: 'padding-left 0.3s',
  },
  paperDrawerOpen: {
    paddingLeft: drawerWidth,
    width: '100%',
    transition: 'padding-left 0.3s',
  },
  logo: {
    height: '42px',
    width: 'auto',
  },
});

/******************************** CLASS ****************************/

class MiniDrawer extends React.Component {
  constructor(props) {
    super(props);
    // STATE
    this.state = {
      open: false,
      ok: false,
      client: props.client,
      currentUser: {},
    };
    // STATE ENDS
  }

  // STARTING STUFF
  async componentDidMount() {
    let temp;
    console.log('Cookies', Cookies.get('jwtToken'));

    if ((await Cookies.get('jwtToken')) !== undefined) {
      console.log('Cookies2', Cookies.get('jwtToken'));

      temp = await this.state.client.query({ query: CURRENTUSER }).catch(e => {
        console.log('blahhh', e);

        Cookies.remove('jwtToken'),
          Router.push({
            pathname: '/login',
          });
        //  (window.location.href = '/login');
      });
      console.log('temp1', temp);
      if (temp) {
        console.log('TEMP', temp);
        temp.data.currentUser !== null
          ? this.setState({ currentUser: temp.data.currentUser, ok: true })
          : (Cookies.remove('jwtToken'),
            Router.push({
              pathname: '/login',
            }),
            (window.location.href = '/login'));
      }
    } else {
      console.log('Cookies2', Cookies.get('jwtToken'));

      try {
        Router.push({
          pathname: '/login',
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  logOut = async () => {
    await Cookies.remove('jwtToken');
    try {
      Router.push({
        pathname: '/login',
      });
      window.location.href = '/login';
    } catch (e) {
      console.log(e);
    }
  };

  // RENDER
  render() {
    const { classes } = this.props;
    const { ok, currentUser } = this.state;

    if (ok) {
      return (
        <div>
          <CssBaseline />
          <AppBar position="sticky" className={classes.appBar}>
            <Toolbar>
              <Link prefetch href="/">
                <Typography className={classes.titleTypo}>
                  <Button
                    size="large"
                    className={classes.titleText}
                    title="Home"
                  >
                    <img
                      src="/static/logo/logoNoBackground.png"
                      alt="borrowd"
                      className={classes.logo}
                    />
                  </Button>
                </Typography>
              </Link>
              <Button
                className={classes.myAccount}
                color="inherit"
                title="Logout"
                onClick={() => this.logOut()}
              >
                <LogoutIcon className={classes.group} /> Logout
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
                paper: classNames(classes.drawerPaper, {
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
                <IconButton
                  onClick={this.handleDrawerClose}
                  className={classNames(classes.menuButton, {
                    [classes.hide]: !this.state.open,
                  })}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </List>
              <Divider />
              <List title="Home">
                <Link prefetch href="/">
                  <ListItem
                    button
                    key="Home"
                    selected={window.location.pathname == '/'}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
              </List>
              {currentUser.userType === 'ADMIN' ||
              currentUser.userType === 'STAFF' ? (
                <List title="Equipments">
                  <Link prefetch href="/equipments">
                    <ListItem
                      button
                      key="Equipments"
                      selected={window.location.pathname == '/equipments'}
                    >
                      <ListItemIcon className={classes.menuIcon}>
                        <DevicesIcon />
                      </ListItemIcon>
                      <ListItemText primary="Equipments" />
                    </ListItem>
                  </Link>
                </List>
              ) : null}
              {currentUser.userType === 'ADMIN' ? (
                <List title="Category">
                  <Link prefetch href="/category">
                    <ListItem
                      button
                      key="Category"
                      selected={window.location.pathname == '/category'}
                    >
                      <ListItemIcon className={classes.menuIcon}>
                        <DeviceCategoriesIcon />
                      </ListItemIcon>
                      <ListItemText primary="Category" />
                    </ListItem>
                  </Link>
                </List>
              ) : null}
              {currentUser.userType === 'ADMIN' ||
              currentUser.userType === 'STAFF' ? (
                <List title="Loans">
                  <Link prefetch href="/loans">
                    <ListItem
                      button
                      key="Loans"
                      selected={window.location.pathname == '/loans'}
                    >
                      <ListItemIcon className={classes.menuIcon}>
                        <LoansIcon />
                      </ListItemIcon>
                      <ListItemText primary="Loans" />
                    </ListItem>
                  </Link>
                </List>
              ) : null}
              {currentUser.userType === 'ADMIN' ||
              currentUser.userType === 'STAFF' ? (
                <List title="Users">
                  <Link prefetch href="/users">
                    <ListItem
                      button
                      key="Users"
                      selected={window.location.pathname == '/users'}
                    >
                      <ListItemIcon className={classes.menuIcon}>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText primary="Users" />
                    </ListItem>
                  </Link>
                </List>
              ) : null}
            </Drawer>
            <div
              className={classNames({
                [classes.paperDrawerOpen]: this.state.open,
                [classes.paperDrawerClose]: !this.state.open,
              })}
              classes={{
                paper: classNames(classes.paper, {
                  [classes.paperDrawerOpen]: this.state.open,
                  [classes.paperDrawerClose]: !this.state.open,
                }),
              }}
            >
              <div className={classes.content}>{this.props.children} </div>
            </div>
          </App>
        </div>
      );
    } else {
      return null;
    }
  }
}

// Props types
MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// EXPORT
export default withStyles(styles, { withTheme: true })(withApollo(MiniDrawer));
