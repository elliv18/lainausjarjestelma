import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  SearchPanel,
  Toolbar,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
  TableFixedColumns,
} from '@devexpress/dx-react-grid-material-ui';
import CheckIcon from '@material-ui/icons/check'
import CancelIcon from '@material-ui/icons/cancel'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { ApolloConsumer } from "react-apollo"

const styles = theme => ({
  root: {
    width: '90%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table: {
    minWidth: 700,
  },
});
  

const BooleanTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={BooleanFormatter}
    {...props}
  />
);

let id = 0;
function createData(
  deviceCategory, manufacture, model, info, loanStatus) {
  id += 1;
  return { id, deviceCategory, manufacture, model, info, loanStatus };
}

const rows = [
  createData('Kannettava', 'Lenovo', 'Abc', 'Kiva kone', false),
  createData('Laite 2', 'Asus', '123', 'Hahaa', false),
  createData('Tv', 'Lg', 'malli1', '120 tuumainen OLED', true),
  createData('Laite 4', 'Abc','malli2', 'infoo!', false),
  createData('Kone 5', 'Cds','malli3', 'infoo123123', false),
];

const getRowId = row => row.id;

const BooleanFormatter = ({ value }) => 
  <Chip color={value? 'primary' : 'secondary'} 
        label={value ? 'Loaned' : 'Available'} 
        icon={value ? <CancelIcon /> : <CheckIcon />}
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
        { name: 'deviceCategory', title: 'Category'},
        { name: 'manufacture', title: 'Manufacture' },
        { name: 'model', title: 'Model' },
        { name: 'info', title: 'Info' },
        { name: 'loanStatus', title: 'Loan', dataType: 'boolean' },
      ],
      tableColumnExtensions:[
        { columnName: 'deviceCategory', wordWrapEnabled: true},
        { columnName: 'manufacture', wordWrapEnabled: true},
        { columnName: 'model', wordWrapEnabled: true},
        { columnName: 'info', wordWrapEnabled: true},
        { columnName: 'loanStatus', wordWrapEnabled: true, width: 150 },
      ],
      booleanColumns: ['loanStatus'],
      rows: rows,
      sorting: [{ columnName: 'id', direction: 'asc' }],
      leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
      
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.changeSorting = sorting => this.setState({ sorting });
  }

  commitChanges({ added, changed, deleted }) {
    let { rows } = this.state;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ rows });
  }

    render(){
        const{classes} = this.props
        const { rows, columns, tableColumnExtensions, sorting, booleanColumns, leftFixedColumns } = this.state;
    return(
        <Paper className ={classes.root} elevation={5}>
        <Grid
          rows={rows}
          columns={columns}
        >
        <EditingState onCommitChanges={this.commitChanges}/>
        <SearchState />
        <IntegratedFiltering />
        <BooleanTypeProvider 
          for={booleanColumns}
          style={{paddingRight: '20px'}}/>
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <Table columnExtensions={tableColumnExtensions} />
          <TableColumnReordering
            defaultOrder={['manufacture', 'model', 'info', 'loanStatus']}
          />
          <TableHeaderRow showSortingControls />
          <TableEditRow />
          <TableEditColumn
            width={180}
            showAddCommand
            showEditCommand
            showDeleteCommand
          />
          <TableFixedColumns
            leftColumns={leftFixedColumns}
          />
          <Toolbar />
          <SearchPanel />
        </Grid>
      </Paper>
    );
    }
}
export default withStyles(styles)(Equipments)

