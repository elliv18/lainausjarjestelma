import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//import { shadows } from '@material-ui/system';
import {
  SearchState,
  SortingState,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid as GridTable,
  Table,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { withApollo } from 'react-apollo';
import { CURRENTUSER } from '../lib/gql/queries';

import Moment from 'react-moment';
import 'moment-timezone';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  root: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 40,
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
    textAlign: 'left',
  },
  input: {
    display: 'none',
  },
  actions: {
    justify: 'right',
  },
  message: {
    textAlign: 'center',
    padding: '10px',
    color: 'red',
  },
};

/******************************** CLASS ******************************/
class Home extends React.Component {
  constructor(props) {
    super(props);

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
      data_user: {},
      data_loans: [],
      open: false,

      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      old_password: '',
      password: '',
      alertMsg: '',
    };
    this.changeSorting = sorting => this.setState({ sorting });
  }

  async componentDidMount() {
    let temp = await this.state.client.query({ query: CURRENTUSER });
    console.log(temp);
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
    this.setState({ data_user: temp_user });
    this.setState({ data_loans: temp_loans });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    console.log(this.state.firstName);
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

  render() {
    const { classes } = this.props;
    const { data_user, data_loans, rows, columns, sorting } = this.state;
    return (
      <Paper className={classes.root}>
        <h1>Summary</h1>
        <Grid
          container
          spacing={16}
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <Grid item xs={11}>
            <Card className={classes.card} elevation={4}>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Account information
                </Typography>
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
                      <DialogTitle id="form-dialog-title-cpi">
                        Change personal information
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Change only new content fields, others can leave
                          empty.
                          <br />
                          <br />
                          <b>Give new information</b>
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="fn"
                          label="First name"
                          type="String"
                          fullWidth
                          onChange={this.setFirstName}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="ln"
                          label="Last name"
                          type="String"
                          fullWidth
                          onChange={this.setLastName}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="address"
                          label="Address"
                          type="String"
                          fullWidth
                          onChange={this.setAddress}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="phone"
                          label="Phone"
                          type="String"
                          fullWidth
                          onChange={this.setPhone}
                        />
                        <DialogTitle id="form-dialog-title-pw">
                          Change password
                        </DialogTitle>
                        <DialogContentText className={classes.message}>
                          <br />
                          {this.state.alertMsg}
                        </DialogContentText>
                        <DialogContentText>
                          <br />
                          <b>Give old and new pass word two times</b>
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="old_pw"
                          label="Old password"
                          type="password"
                          fullWidth
                          onChange={this.setOldPW}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="new_pw"
                          label="New password"
                          type="password"
                          fullWidth
                          onChange={this.setNewPW}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="new_pw_check"
                          label="Again new password"
                          type="password"
                          fullWidth
                          onChange={this.setNewPWCheck}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                          Change
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </CardActions>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <h2>Your loans</h2>
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
              </GridTable>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(withApollo(Home));
