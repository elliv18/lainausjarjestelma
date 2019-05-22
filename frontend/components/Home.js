import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
import { generateRows } from '../src/demo-data/generator';
import { withApollo } from 'react-apollo';
import { CURRENTUSER } from '../lib/gql/queries';

import Moment from 'react-moment';
import 'moment-timezone';


const styles = {
  root:{
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
    marginRight:'auto',
    marginBottom: '10px',
    marginTop: '10px',
  },
  paperTable:{
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  
}

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
      rows: generateRows({ length: 30 }),
      

      client: props.client,
      data_user: {},
      data_loans: []
    };
    this.changeSorting = sorting => this.setState({ sorting });
  }

  async componentDidMount(){
    let temp = await this.state.client.query({ query: CURRENTUSER })
    console.log(temp)
    let temp_user
    let temp_loans = []
    if (temp.data.currentUser){
      temp_user = {
        userType: temp.data.currentUser.userType,
        email:  temp.data.currentUser.email,
        firstName: temp.data.currentUser.firstName,
        lastName: temp.data.currentUser.lastName,
        address: temp.data.currentUser.address,
        personNumber: temp.data.currentUser.personNumber,
        phone: temp.data.currentUser.phone
      }
      temp.data.currentUser.loans.map((obj,i) => {
        if (obj.isActive === "true"){
          temp_loans[i] = {
            id: obj.id,
            loanDate: obj.loanDate !== null ? <Moment>{obj.loanDate}</Moment> : null,
            returnDate: obj.returnDate !== null ? <Moment>{obj.returnDate}</Moment> : null,
            dueDate: obj.dueDate !== null ? <Moment>{obj.dueDate}</Moment> : null,
            idCode: obj.deviceId.idCode,
            manufacture: obj.deviceId.manufacture,
            model: obj.deviceId.model,
            deviceType: obj.deviceId.devCategory.deviceType
          }
        }
      })
    }
    this.setState({ data_user: temp_user })
    this.setState({ data_loans: temp_loans })
  }

  render() {
    const { classes } = this.props;
    const { 
      data_user,
      data_loans,
      rows, 
      columns,
      sorting
    } = this.state;
    return (
      <Paper className={classes.root}>
        <h1>Summary</h1>
        <Grid container spacing={16}
              direction="row"
              justify="space-evenly"
              alignItems="center">
          <Grid item xs={5}>
              <Paper className={classes.paper}>
                <h1>Account information</h1>
                <p>
                  User type: {data_user.userType} {<br></br>}
                  First name: {data_user.firstName} {<br></br>}
                  Last name: {data_user.lastName} {<br></br>}
                  Email: {data_user.email} {<br></br>}
                  Address: {data_user.address} {<br></br>}
                  Person number: {data_user.personNumber} {<br></br>}
                  Phone: {data_user.phone}
                </p>
              </Paper>
          </Grid>
          <Grid item xs={5}>
              <Paper className={classes.paper}>
                <h1>Info table</h1>
              </Paper>
          </Grid>
          <Grid item xs ={12}>
              <h2>Your loans</h2>
            <Paper className={classes.paperTable}>
              <GridTable
                rows={data_loans}
                columns={columns}
              >
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
    )
  };
}


export default withStyles(styles)(withApollo(Home));
