import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loading from './Loading';
import ToolbarTitle from '../src/ToolbarTitle';

import {
  SearchState,
  SortingState,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid as GridTable,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import { withApollo } from 'react-apollo';
import { CURRENTUSER } from '../lib/gql/queries';
import { CURRENTUSER_UPDATE_MUTATION } from '../lib/gql/mutation';

import Moment from 'react-moment';
import 'moment-timezone';

/********************* STYLES ***********************/

const styles = {
  root: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#E7EEEF',
  },
  paper: {
    height: 300,
    width: '100%',
    backgroundColor: 'lightGrey',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
    marginTop: '10px',
  },
  paperTable: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    width: '90%',
    textAlign: 'left',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
    marginTop: '10px',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    backgroundColor: 'lightGrey',
    textAlign: 'left',
    padding: 20,
  },
  input: {
    display: 'none',
  },
  actions: {
    justify: 'right',
  },
  message: {
    textAlign: 'center',
    color: 'red',
  },
  dialogTitle: {
    backgroundColor: 'lightGrey',
  },
};

/******************************** CLASS ******************************/

class Home extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      columns: [
        { name: 'deviceType', title: 'Device type' },
        { name: 'idCode', title: 'ID code' },
        { name: 'manufacture', title: 'Manufacture' },
        { name: 'model', title: 'Model' },
        { name: 'loanDate', title: 'Loan date' },
        { name: 'returnDate', title: 'return date' },
        { name: 'dueDate', title: 'Due date' },
      ],

      client: props.client,
      data_user: {
        userType: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        personNumber: '',
      },
      data_loans: [],
      open: false,
      client: props.client,

      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      old_password: '',
      password: '',
      alertMsg: '',
      alertMsgMain: '',
      loading: true,
    };
    this.changeSorting = sorting => this.setState({ sorting });
  }

  // STATE ENDS

  // STARTING QUERY
  async componentDidMount() {
    const JWT = localStorage.getItem('jwtToken');
    if (JWT !== null) {
      let temp = await this.state.client.query({ query: CURRENTUSER });
      let temp_user;
      let temp_loans = [];
      if (temp.data.currentUser) {
        temp_user = {
          userType: temp.data.currentUser.userType,
          email: temp.data.currentUser.email,
          firstName: temp.data.currentUser.firstName,
          lastName: temp.data.currentUser.lastName,
          address: temp.data.currentUser.address,
          personNumber: temp.data.currentUser.personNumber,
          phone: temp.data.currentUser.phone,
        };
        temp.data.currentUser.loans.map((obj, i) => {
          if (obj.isActive === 'true') {
            temp_loans[i] = {
              id: obj.id,
              loanDate:
                obj.loanDate !== null ? <Moment>{obj.loanDate}</Moment> : null,
              returnDate:
                obj.returnDate !== null ? (
                  <Moment>{obj.returnDate}</Moment>
                ) : null,
              dueDate:
                obj.dueDate !== null ? <Moment>{obj.dueDate}</Moment> : null,
              idCode: obj.deviceId.idCode,
              manufacture: obj.device.manufacture,
              model: obj.deviceId.model,
              deviceType: obj.device.category.deviceType,
            };
          }
        });
      }
      this.setState({
        data_user: temp_user,
        data_loans: temp_loans,
        loading: false,
      });
    }
  }

  // FUNCTIONS

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCloseSave = async () => {
    this.state.client
      .mutate({
        variables: {
          firstName: this.state.firstName ? this.state.firstName : null,
          lastName: this.state.lastName ? this.state.lastName : null,
          address: this.state.address ? this.state.address : null,
          phone: this.state.phone ? this.state.phone : null,
          password: this.state.password ? this.state.password : null,
          old_password: this.state.old_password
            ? this.state.old_password
            : null,
        },
        mutation: CURRENTUSER_UPDATE_MUTATION,
      })
      .then(result => {
        console.log('result', result);
        this.setState(state => ({
          data_user: {
            ...state.data_user,
            firstName: result.data.currentUserUpdate.user.firstName,
            lastName: result.data.currentUserUpdate.user.lastName,
            address: result.data.currentUserUpdate.user.address,
            phone: result.data.currentUserUpdate.user.phone,
          },
        }));
      })
      .catch(error => {
        this.setState({ alertMsgMain: 'Personal information update failed!' });
        console.log(error);
      });

    this.setState({ open: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  setFirstName = e => {
    this.setState({ firstName: e.target.value });
  };

  setLastName = e => {
    this.setState({ lastName: e.target.value });
  };

  setAddress = e => {
    this.setState({ address: e.target.value });
  };

  setPhone = e => {
    this.setState({ phone: e.target.value });
  };

  setOldPW = e => {
    this.setState({ old_password: e.target.value });
  };

  setNewPW = e => {
    this.setState({ password: e.target.value });
  };

  setNewPWCheck = e => {
    if (this.state.password !== e.target.value) {
      this.setState({ alertMsg: 'Password dont match!' });
    } else {
      this.setState({ alertMsg: '' });
    }
  };

  // RENDER
  render() {
    const { classes } = this.props;
    const { data_user, data_loans, columns, sorting, loading } = this.state;
    if (loading && (data_user || {}.firstName)) {
      return <Loading />;
    } else {
      return (
        <Paper className={classes.root}>
          <div className={classes.message}>{this.state.alertMsgMain}</div>
          <h1>Summary</h1>
          <Grid
            container
            spacing={16}
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card className={classes.card} elevation={4}>
                <CardHeader
                  title="Account information"
                  titleTypographyProps={{ variant: 'h4' }}
                  className={classes.cardTitle}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <Typography variant="h5" component="h2">
                        First name: {data_user.firstName} {<br />}
                        Last name: {data_user.lastName} {<br />}
                        Address: {data_user.address} {<br />}
                        Phone: {data_user.phone} {<br />}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" component="h2">
                        Email: {data_user.email} {<br />}
                        Person number: {data_user.personNumber} {<br />}
                        User type: {data_user.userType} {<br />}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <Grid item xs={12}>
                  <Grid container justify="flex-end">
                    <CardActions>
                      <Grid item>
                        <Button onClick={this.handleClickOpen}>
                          Change personal information
                        </Button>
                      </Grid>
                      <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title-cpi"
                      >
                        <DialogTitle
                          className={classes.dialogTitle}
                          id="form-dialog-title-cpi"
                        >
                          Change personal information
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Change only new content fields, others can leave
                            empty.
                            <br />
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="fn"
                            label="First name"
                            type="String"
                            fullWidth
                            onChange={this.setFirstName}
                          />
                          <TextField
                            margin="dense"
                            id="ln"
                            label="Last name"
                            type="String"
                            fullWidth
                            onChange={this.setLastName}
                          />
                          <TextField
                            margin="dense"
                            id="address"
                            label="Address"
                            type="String"
                            fullWidth
                            onChange={this.setAddress}
                          />
                          <TextField
                            margin="dense"
                            id="phone"
                            label="Phone"
                            type="String"
                            fullWidth
                            onChange={this.setPhone}
                          />
                        </DialogContent>
                        <DialogTitle
                          className={classes.dialogTitle}
                          id="form-dialog-title-pw"
                        >
                          Change password
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Give old and new pass word two times
                          </DialogContentText>
                          <DialogContentText className={classes.message}>
                            <br />
                            {this.state.alertMsg}
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="old_pw"
                            label="Old password"
                            type="password"
                            fullWidth
                            onChange={this.setOldPW}
                          />
                          <TextField
                            margin="dense"
                            id="new_pw"
                            label="New password"
                            type="password"
                            fullWidth
                            onChange={this.setNewPW}
                          />
                          <TextField
                            margin="dense"
                            id="new_pw_check"
                            label="Again new password"
                            type="password"
                            fullWidth
                            onChange={this.setNewPWCheck}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={this.handleCloseSave}
                            color="primary"
                          >
                            Save
                          </Button>
                          <Button onClick={this.handleClose} color="primary">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardActions>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paperTable} elevation={6}>
                <GridTable rows={data_loans} columns={columns}>
                  <SearchState />
                  <SortingState
                    sorting={sorting}
                    onSortingChange={this.changeSorting}
                  />
                  <IntegratedFiltering />
                  <IntegratedSorting />
                  <VirtualTable />
                  <TableHeaderRow showSortingControls />
                  <Toolbar />
                  <SearchPanel />
                  <ToolbarTitle title="Active loans" />
                </GridTable>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      );
    }
  }
}

// EXPORT
export default withStyles(styles)(withApollo(Home));
