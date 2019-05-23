import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { shadows } from '@material-ui/system';
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
                <Typography variant="h5" component="h2" />
              </CardContent>
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
