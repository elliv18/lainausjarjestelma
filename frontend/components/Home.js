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
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import Loading from './Loading';
import ToolbarTitle from '../src/ToolbarTitle';

import {
  SearchState,
  SortingState,
  IntegratedFiltering,
  IntegratedSorting,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid as GridTable,
  VirtualTable,
  Toolbar,
  SearchPanel,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import { withApollo } from 'react-apollo';
import { CURRENTUSER } from '../lib/gql/queries';
import { CURRENTUSER_UPDATE_MUTATION } from '../lib/gql/mutation';
import Cookies from 'js-cookie';
//import Moment from 'react-moment';
//import 'moment-timezone';

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
    backgroundColor: 'rgba(0,70,85)',
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
  typoFirst: {
    color: 'grey',
  },
  typoSecond: {
    marginLeft: '0.5em',
    marginTop: '0.02em',
  },
};

/******************************** CLASS ******************************/

var moment = require('moment');

const TableRow = ({ row, ...restProps }) => (
  <Table.Row
    {...restProps}
    style={{
      backgroundColor:
        moment(row.dueDate).format('YYYY MM DD') <
          moment().format('YYYY MM DD') && row.isActive
          ? '#DB2B39'
          : moment(row.dueDate).format('YYYY MM DD') ==
              moment().format('YYYY MM DD') && row.isActive
          ? '#F6BF52'
          : row.isActive == false
          ? '#9C9C9C'
          : undefined,
    }}
  />
);

const DateFormatter = ({ value }) =>
  value !== null ? moment(value).format('DD-MM-YYYY') : value;

const DateTypeProvider = props => (
  <DataTypeProvider formatterComponent={DateFormatter} {...props} />
);

const BooleanTypeProvider = props => (
  <DataTypeProvider formatterComponent={BooleanFormatter} {...props} />
);

const BooleanFormatter = ({ value }) => (
  <Chip
    color={'primary'}
    label={value ? 'Active' : 'Returned'}
    icon={value ? <CancelIcon /> : <CheckIcon />}
    style={
      value
        ? {
            backgroundColor: '#DB2B39',
            width: '110px',
            justifyContent: 'left',
          }
        : { backgroundColor: '#018E42' }
    }
  />
);

class Home extends React.Component {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      columns: [
        { name: 'idCode', title: 'ID code' },
        { name: 'deviceCategory', title: 'Device type' },
        { name: 'manufacture', title: 'Manufacture' },
        { name: 'model', title: 'Model' },
        { name: 'loanDate', title: 'Loan date' },
        { name: 'dueDate', title: 'Due date' },
        { name: 'returnDate', title: 'Return date' },
        { name: 'isActive', title: 'Loan status' },
      ],
      tableColumnExtensions: [
        { columnName: 'idCode', wordWrapEnabled: true },
        { columnName: 'deviceCategory', wordWrapEnabled: true },
        { columnName: 'manufacture', wordWrapEnabled: true },
        { columnName: 'model', wordWrapEnabled: true },
        { columnName: 'loanDate', wordWrapEnabled: true },
        { columnName: 'dueDate', wordWrapEnabled: true },
        { columnName: 'returnDate', wordWrapEnabled: true },
        { columnName: 'isActive', wordWrapEnabled: true },
      ],

      dateColumns: ['loanDate', 'returnDate', 'dueDate'],
      booleanColumns: ['isActive'],
      defaultSorting: [{ columnName: 'isActive', direction: 'desc' }],
      sortingStateColumnExtensions: [
        { columnName: 'isActive', sortingEnabled: false },
      ],
      sorting: [
        { columnName: 'isActive', direction: 'desc' },
        { columnName: 'dueDate', direction: 'asc' },
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
      dateColumns: ['loanDate', 'returnDate', 'dueDate'],
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      oldPassword: '',
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
    console.log(this.props.data);
    const JWT = Cookies.get('jwtToken');
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
          temp_loans[i] = {
            id: obj.id,
            loanDate: obj.loanDate !== null ? obj.loanDate : null,
            returnDate: obj.returnDate !== null ? obj.returnDate : null,
            dueDate: obj.dueDate !== null ? obj.dueDate : null,
            idCode: obj.device.idCode,
            manufacture: obj.device.manufacture,
            model: obj.device.model,
            deviceCategory: obj.device.category.deviceCategory,
            isActive: obj.isActive,
          };
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
          oldPassword: this.state.oldPassword ? this.state.oldPassword : null,
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
    this.setState({ oldPassword: e.target.value });
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
    const {
      data_user,
      data_loans,
      columns,
      sorting,
      loading,
      tableColumnExtensions,
      dateColumns,
      booleanColumns,
      defaultSorting,
      sortingStateColumnExtensions,
    } = this.state;
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
              <Paper className={classes.paperTable} elevation={6}>
                <GridTable rows={data_loans} columns={columns}>
                  <SearchState />
                  <SortingState
                    sorting={sorting}
                    onSortingChange={this.changeSorting}
                    defaultSorting={defaultSorting}
                    columnExtensions={sortingStateColumnExtensions}
                  />
                  <IntegratedFiltering />
                  <IntegratedSorting />
                  <BooleanTypeProvider
                    for={booleanColumns}
                    style={{ paddingRight: '20px' }}
                  />
                  <DateTypeProvider for={dateColumns} />
                  <VirtualTable
                    rowComponent={TableRow}
                    columnExtensions={tableColumnExtensions}
                    height="400"
                  />
                  <TableHeaderRow showSortingControls />
                  <Toolbar />
                  <SearchPanel />
                  <ToolbarTitle title="Your loans" />
                </GridTable>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.card} elevation={4}>
                <CardHeader
                  title="Account information"
                  titleTypographyProps={{
                    variant: 'h4',
                    style: { color: '#fff' },
                  }}
                  className={classes.cardTitle}
                />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          First name:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.firstName}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          Last name:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.lastName}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          Address:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.address}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          Phone:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.phone}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          Email:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.email}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          Person number:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.personNumber}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className={classes.typoFirst}>
                          User type:
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          className={classes.typoSecond}
                        >
                          {data_user.userType}
                        </Typography>
                      </div>
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
          </Grid>
        </Paper>
      );
    }
  }
}

// EXPORT
export default withStyles(styles)(withApollo(Home));
