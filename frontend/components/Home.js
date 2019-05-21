import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid as GridTable,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { generateRows } from '../src/demo-data/generator';


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

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Device type' },
        { name: 'sex', title: 'Loan date' },
        { name: 'city', title: 'Due date' },
        { name: 'car', title: 'Return date' },
      ],
      rows: generateRows({ length: 30 }),
    };
  }

  render() {
    const { classes } = this.props;
    const { rows, columns } = this.state;
    return (
      <Paper className={classes.root}>
        <h1>Summary</h1>
        <Grid container spacing={12}
              direction="row"
              justify="space-evenly"
              alignItems="center">
          <Grid item xs={5}>
              <Paper className={classes.paper}>
                Account information
              </Paper>
          </Grid>
          <Grid item xs={5}>
              <Paper className={classes.paper}>
                Info table
              </Paper>
          </Grid>
          <Grid item xs ={12}>
              <h2>Your loans</h2>
            <Paper className={classes.paperTable}>
              <GridTable
                rows={rows}
                columns={columns}
              >
                <SearchState />
                <IntegratedFiltering />
                <VirtualTable />
                <TableHeaderRow />
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


export default withStyles(styles)(Home);
