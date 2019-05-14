import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Check from '@material-ui/icons/check'
import Cancel from '@material-ui/icons/cancel'
import { ApolloConsumer } from "react-apollo"

const styles = theme => ({
    root: {
      width: '85%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    table: {
      minWidth: 700,
    },
  });
  
  let id = 0;
  function createData(
    name, model, info, loanStatus) {
    id += 1;
    return { id, name, model, info, loanStatus };
  }
  
  const rows = [
    createData('Kannettava', 'Lenovo', 'Kiva kone', false),
    createData('Laite 2', 'Asus', 'Hahaa', false),
    createData('Tv', 'Lg', '120 tuumainen OLED', true),
    createData('Laite 4', 'Abc', 'infoo!', false),
    createData('Kone 5', 'Cds', 'infoo123123', false),
  ];

  const BooleanTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={BooleanFormatter}
      {...props}
    />
  );

  const BooleanFormatter = ({ value }) => 
  <Chip color={value? 'primary' : 'secondary'} 
        label={value ? 'Loaned' : 'Available'} 
        icon={value ? <Cancel /> : <Check/>}
        style={value? {backgroundColor:'rgba(204,0,0,0.85)', 
                        width: '115px', 
                        justifyContent: 'left'}
        :{backgroundColor: 'rgba(0,128,0,0.75)'}}
        />;


class Equipments extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'id', title: 'Id' },
        { name: 'name', title: 'Name' },
        { name: 'model', title: 'Model' },
        { name: 'info', title: 'Info' },
        { name: 'loanStatus', title: 'Loan', dataType: 'boolean' },
      ],
      tableColumnExtensions:[
        { columnName: 'id', wordWrapEnabled: true, width: 80},
        { columnName: 'name', wordWrapEnabled: true},
        { columnName: 'model', wordWrapEnabled: true},
        { columnName: 'info', wordWrapEnabled: true},
        { columnName: 'loanStatus', wordWrapEnabled: true, width: 150 }
      ],
      booleanColumns: ['loanStatus'],
      rows: rows,
      sorting: [{ columnName: 'id', direction: 'asc' }],
      
    };

    this.changeSorting = sorting => this.setState({ sorting });
  }
    render(){
        const{classes} = this.props
        const { rows, columns, tableColumnExtensions, sorting, booleanColumns } = this.state;
    return(
      <div className={classes.root}>
        <Paper>
        <Grid
          rows={rows}
          columns={columns}

        >
        <BooleanTypeProvider 
          for={booleanColumns}
          style={{paddingRight: '20px'}}/>
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow showSortingControls />
        </Grid>
      </Paper>
      </div>
    );
    }
}
export default withStyles(styles)(Equipments)

