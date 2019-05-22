import React from 'react';
import {
    Getter,
  } from '@devexpress/dx-react-core';
import {
  SortingState, EditingState, PagingState, 
  IntegratedPaging, IntegratedSorting, 
  SearchState, IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable, TableHeaderRow, TableEditRow, TableEditColumn,
  DragDropProvider, TableColumnReordering, SearchPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';

import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import {
  generateRows,
  equipmentsValues,
} from '../src/demo-data/generator';
import { string } from 'prop-types';
import { Query, withApollo } from 'react-apollo'
import { USERS_QUERY } from '../lib/gql/queries'

const styles = theme => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  root: {
    width: '90%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table: {
    height: '800px',
    overflowY: 'auto',
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute();
      }
    }}
    title="Delete row"
  >
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};

const availableValues = {

};

const LookupEditCellBase = ({
  availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={(
        <Input
          classes={{ root: classes.inputRoot }}
        />
)}
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);


const EditCell = (props) => {
  const { column } = props;
  const availableColumnValues = availableValues[column.name];
  if (availableColumnValues) {
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
  }
  return <TableEditRow.Cell {...props} />;
};


const BooleanTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={BooleanFormatter}
      {...props}
    />
  );

const BooleanFormatter = ({ value }) => 
  <Chip color={value? 'primary' : 'secondary'} 
        label={value ? 'Active' : 'Inactive'} 
        icon={value ? <CheckIcon /> :<CancelIcon /> }
        style={value? {backgroundColor:'rgba(0,128,0,0.75)', 
                        width: '105px', 
                        justifyContent: 'left'}
        :{backgroundColor: 'rgba(204,0,0,0.85)'}}
        />;

const getRowId = row => row.id;
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

class DemoBase extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'userType', title: 'Type'},
        { name: 'firstName', title: 'Firstname' },
        { name: 'lastName', title: 'Lastname' },
        { name: 'email', title: 'Email' },
        { name: 'isActive', title: 'Active status' },
        { name: 'address', title: 'Address' },
        { name: 'personNumber', title: 'Person number' },
        { name: 'phone', title: 'Phone' },
        { name: 'createdAt', title: 'Created' },
        { name: 'updatedAt', title: 'Updated' }
      ],
      tableColumnExtensions: [
        { columnName: 'userType', wordWrapEnabled: true, width: 110},
        { columnName: 'firstName', wordWrapEnabled: true, width: 120},
        { columnName: 'lastName', wordWrapEnabled: true, width: 130},
        { columnName: 'email', wordWrapEnabled: true, width: 250},
        { columnName: 'isActive', wordWrapEnabled: true, width: 120},
      ],
      editingColumns:[
        //{ columnName: 'userType', editingEnabled: true },
        { columnName: 'firstName', editingEnabled: true },
        { columnName: 'lastName', editingEnabled: true },
        { columnName: 'email', editingEnabled: true },
      ],
      rows: generateRows({
        columnValues: { id: ({ index }) => index, ...equipmentsValues },
        length: 12,
      }),
      sorting: [],
      editingRowIds: ['firstName', 'lastName', 'email'],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      pageSize: 0,
      booleanColumns: ['isActive'],
      columnOrder: ['userType', 'firstName', 'lastName', 'email', 'isActive'],
      client: props.client,
      data: []
    };
    const getStateRows = () => {
      const { rows } = this.state;
      return rows;
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
        firstName: "",
        lastName: "",
        email: "",

      })),
    });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
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
        rows = this.deleteRows(deleted);
      }
      this.setState({ rows });
    };
    this.deleteRows = (deletedIds) => {
      const rows = getStateRows().slice();
      deletedIds.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          rows.splice(index, 1);
        }
      });
      return rows;
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  async componentDidMount(){

    let temp = await this.state.client.query({
      query: USERS_QUERY
    })
    let temp2 = []
    if(temp.data.allUsers){
      temp.data.allUsers.map((obj,i) => (
        temp2[i] = {
          id: obj.id,
          userType: obj.userType,
          isActive: obj.isActive,
          lastName: obj.lastName,
          email: obj.email,
          firstName: obj.firstName
        }
      ))
    }
    this.setState({data: temp2})
  }

  render() {
    const{classes} = this.props
    const {
      data,
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      pageSize,
      columnOrder,
      booleanColumns,
      editingColumns,
    } = this.state;

    
     
      return (
        <Paper className ={classes.root} elevation={5}>
        <Grid
          rows={data}
          columns={columns}
          getRowId={getRowId}
        >
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <EditingState
            columnEditingEnabled={false}
            columnExtensions={editingColumns}
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />
          <SearchState />

          <IntegratedFiltering />

          <IntegratedSorting />

          <IntegratedPaging />

          <DragDropProvider />

          <BooleanTypeProvider 
          for={booleanColumns}
          style={{paddingRight: '20px'}}/>

          <VirtualTable
            columnExtensions={tableColumnExtensions}
          />
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={170}
            showAddCommand={!addedRows.length}
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <Getter
          name="tableColumns"
          computed={({ tableColumns }) => {
            
            const result = [
              ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
              { key: 'editCommand', type: TableEditColumn.COLUMN_TYPE, width: 140 }
            ];
            return result;
          }
          }
        />
          <Toolbar />

          <SearchPanel />
        
        </Grid>
      </Paper>
      
  );
  }
}

export default withStyles(styles, { name: 'ControlledModeDemo' })(withApollo(DemoBase));
