import React from 'react';
import { Getter } from '@devexpress/dx-react-core';
import {
  SortingState,
  EditingState,
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
  RowDetailState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  DragDropProvider,
  TableColumnReordering,
  SearchPanel,
  Toolbar,
  Table,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo } from 'react-apollo';
import { LOANS_QUERY } from '../lib/gql/queries';

import Moment from 'react-moment';
import 'moment-timezone';

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
    <Button color="primary" onClick={onExecute} title="Create new row">
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
  return <CommandButton onExecute={onExecute} />;
};

const availableValues = {};

const LookupEditCellBase = ({
  availableColumnValues,
  value,
  onValueChange,
  classes,
}) => (
  <TableCell className={classes.lookupEditCell}>
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={<Input classes={{ root: classes.inputRoot }} />}
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, {
  name: 'ControlledModeDemo',
})(LookupEditCellBase);

const EditCell = props => {
  const { column } = props;
  const availableColumnValues = availableValues[column.name];
  if (availableColumnValues) {
    return (
      <LookupEditCell
        {...props}
        availableColumnValues={availableColumnValues}
      />
    );
  }
  return <TableEditRow.Cell {...props} />;
};

const BooleanTypeProvider = props => (
  <DataTypeProvider formatterComponent={BooleanFormatter} {...props} />
);

const BooleanFormatter = ({ value }) => (
  <Chip
    color={value ? 'primary' : 'secondary'}
    label={value ? 'Active' : 'Returned'}
    icon={value ? <CheckIcon /> : <CancelIcon />}
    style={
      value
        ? {
            backgroundColor: 'rgba(0,128,0,0.75)',
            width: '110px',
            justifyContent: 'left',
          }
        : { backgroundColor: 'rgba(204,0,0,0.85)' }
    }
  />
);

const getRowId = row => row.id;

const RowDetail = ({ row }) => (
  <Grid
    rows={[
      {
        loaner: row.loanerFirstName + ' ' + row.loanerLastName,
        loanerEmail: row.loanerEmail,
        supplier: row.supplierFirstName + ' ' + row.supplierLastName,
        supplierEmail: row.supplierEmail,
      },
    ]}
    columns={[
      { name: 'loaner', title: 'Loaner' },
      { name: 'loanerEmail', title: 'Email' },
      { name: 'supplier', title: 'Supplier' },
      { name: 'supplierEmail', title: 'Email' },
    ]}
  >
    <Table
      columnExtensions={[
        { columnName: 'loaner', wordWrapEnabled: true, width: 170 },
        { columnName: 'loanerEmail', width: 300 },
        { columnName: 'supplier', wordWrapEnabled: true, width: 170 },
        { columnName: 'supplierEmail', width: 300 },
      ]}
    />
    <TableHeaderRow />
  </Grid>
);

/****************************** CLASS ********************************************************/

class Loans extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'idCode', title: 'ID Code' },
        { name: 'deviceType', title: 'Category' },
        { name: 'manufacture', title: 'Manufacture' },
        { name: 'model', title: 'Model' },
        { name: 'loaner', title: 'Loaner' },
        { name: 'loanDate', title: 'Loan date' },
        { name: 'returnDate', title: 'Return date' },
        { name: 'dueDate', title: 'Due date' },
        { name: 'isActive', title: 'Active status' },
      ],
      tableColumnExtensions: [
        { columnName: 'idCode', wordWrapEnabled: true },
        { columnName: 'deviceType', wordWrapEnabled: true },
        { columnName: 'manufacture', wordWrapEnabled: true },
        { columnName: 'model', wordWrapEnabled: true },
        { columnName: 'loaner', wordWrapEnabled: true },
        { columnName: 'loanDate', wordWrapEnabled: true },
        { columnName: 'returnDate', wordWrapEnabled: true },
        { columnName: 'dueDate', wordWrapEnabled: true },
        { columnName: 'isActive', wordWrapEnabled: true },
      ],
      editingColumns: [
        { columnName: 'idCode', editingEnabled: true },
        { columnName: 'deviceType', editingEnabled: true },
        { columnName: 'manufacture', editingEnabled: true },
        { columnName: 'model', editingEnabled: true },
        { columnName: 'loaner', editingEnabled: false },
        { columnName: 'loanDate', editingEnabled: true },
        { columnName: 'returnDate', editingEnabled: true },
        { columnName: 'dueDate', editingEnabled: true },
        { columnName: 'isActive', editingEnabled: false },
      ],
      sorting: [],
      editingRowIds: [
        'idCode',
        'deviceType',
        'manufacture',
        'model',
        'loanDate',
        'returnDate',
        'dueDate',
        'isActive',
      ],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      pageSize: 0,
      booleanColumns: ['isActive'],
      columnOrder: [
        'idCode',
        'deviceType',
        'manufacture',
        'model',
        'loaner',
        'loanDate',
        'returnDate',
        'dueDate',
        'isActive',
      ],
      client: props.client,
      data: [],
    };
    const getStateRows = () => {
      const { rows } = this.state;
      return rows;
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds =>
      this.setState({ editingRowIds });
    this.changeAddedRows = addedRows =>
      this.setState({
        addedRows: addedRows.map(row =>
          Object.keys(row).length
            ? row
            : {
                loanDate: '',
                returnDate: '',
                dueDate: '',
                isActive: '',
                idCode: '',
                manufacture: '',
                model: '',
                deviceType: '',
                loaner: '',
              }
        ),
      });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      let { rows } = this.state;
      if (added) {
        const startingAddedId =
          rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
        rows = [
          ...rows,
          ...added.map((row, index) => ({
            id: startingAddedId + index,
            ...row,
          })),
        ];
        //
        console.log(rows);
      }
      if (changed) {
        rows = rows.map(row =>
          changed[row.id] ? { ...row, ...changed[row.id] } : row
        );
      }
      if (deleted) {
        rows = this.deleteRows(deleted);
      }
      this.setState({ rows });
    };
    this.deleteRows = deletedIds => {
      const rows = getStateRows().slice();
      deletedIds.forEach(rowId => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          rows.splice(index, 1);
        }
      });
      return rows;
    };
    this.changeColumnOrder = order => {
      this.setState({ columnOrder: order });
    };
  }

  async componentDidMount() {
    let temp = await this.state.client.query({ query: LOANS_QUERY });

    let temp2 = [];
    if (temp.data.allLoans) {
      temp.data.allLoans.map(
        (obj, i) =>
          (temp2[i] = {
            id: obj.id,
            loanDate:
              obj.loanDate !== null ? <Moment>{obj.loanDate}</Moment> : null,
            returnDate:
              obj.returnDate !== null ? (
                <Moment>{obj.returnDate}</Moment>
              ) : null,
            dueDate:
              obj.dueDate !== null ? <Moment>{obj.dueDate}</Moment> : null,
            isActive: obj.isActive,
            idCode: obj.device.idCode,
            manufacture: obj.device.manufacture,
            model: obj.device.model,
            deviceType: obj.device.category.deviceType,
            loaner: obj.loaner.firstName + ' ' + obj.loaner.lastName,
            loanerFirstName: obj.loaner.firstName,
            loanerLastName: obj.loaner.lastName,
            loanerEmail: obj.loaner.email,
            supplierFirstName: obj.supplier.firstName,
            supplierLastName: obj.supplier.lastName,
            supplierEmail: obj.supplier.email,
          })
      );
    }
    this.setState({ data: temp2 });
  }

  // RENDER
  render() {
    const { classes } = this.props;
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
      <Paper className={classes.root} elevation={5}>
        <Grid rows={data} columns={columns} getRowId={getRowId}>
          <RowDetailState />
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
            style={{ paddingRight: '20px' }}
          />

          <VirtualTable
            columnExtensions={tableColumnExtensions}
            className={classes.table}
          />
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls />
          <TableRowDetail contentComponent={RowDetail} />
          <TableEditRow cellComponent={EditCell} />
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
                ...tableColumns.filter(
                  c => c.type !== TableEditColumn.COLUMN_TYPE
                ),
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: 140,
                },
              ];
              return result;
            }}
          />
          <Toolbar />
          <SearchPanel />
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Loans)
);
