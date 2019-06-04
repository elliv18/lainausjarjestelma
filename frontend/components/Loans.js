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
  ColumnChooser,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
//import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import ToolbarTitle from '../src/ToolbarTitle';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo } from 'react-apollo';
import {
  LOANS_QUERY,
  EMAILS_QUERY,
  DEVICE_ID_QUERY,
  CURRENTUSER,
} from '../lib/gql/queries';
import { LOAN_ADD_MUTATION, LOAN_RETURN_MUTATION } from '../lib/gql/mutation';
import Moment from 'react-moment';
import 'moment-timezone';
import Loading from './Loading';
import Select from 'react-select';

/********************* STYLES ************************************/

const styles = theme => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  root: {
    width: '90%',
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

/***************************** FUNCTIONS *****************************/
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
          : undefined,
    }}
  />
);

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

const availableValues = {
  loanDate: Date,
  returnDate: Date,
  dueDate: Date,
  loaner: String,
  idCode: String,
};

let arrayEmails = null;
let arrayIdCodes = null;

let emails = [];

function editEmails() {
  let temp = [];
  emails.map((row, i) => {
    temp[i] = {
      label: row.email,
      value: row.email,
    };
  });
  return temp;
}

function editIdCodes(idCodes) {
  let temp = [];
  idCodes.map((row, i) => {
    temp[i] = {
      label: row.idCode,
      value: row.idCode,
    };
  });
  console.log('IdCodes loaded', temp);

  return temp;
}

const LookupEditCellBase = ({ onValueChange, classes, column, tableRow }) =>
  column.name == 'loaner' &&
  tableRow.type.toString() === 'Symbol(added)' &&
  tableRow.row.isActive ? (
    <TableCell className={classes.lookupEditCell}>
      <Select
        options={(arrayEmails = editEmails())}
        //onChange={opt => console.log(opt.label, opt.value)}
        onChange={opt => console.log(opt.label, opt.value)}
        onChange={event => onValueChange(event.value)}
      />
    </TableCell>
  ) : column.name == 'idCode' &&
    tableRow.type.toString() === 'Symbol(added)' &&
    tableRow.row.isActive ? (
    <TableCell className={classes.lookupEditCell}>
      <Select
        options={arrayIdCodes}
        //onChange={opt => console.log(opt.label, opt.value)}
        onChange={opt => console.log(opt.label, opt.value)}
        onChange={event => onValueChange(event.value)}
      />
    </TableCell>
  ) : tableRow.type.toString() === 'Symbol(added)' &&
    tableRow.row.isActive &&
    column.name !== 'returnDate' ? (
    <TableCell className={classes.lookupEditCell}>
      <TextField
        id="date"
        type="date"
        onChange={event => onValueChange(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth={true}
      />
    </TableCell>
  ) : column.name === 'returnDate' &&
    tableRow.row.isActive &&
    tableRow.type.toString() !== 'Symbol(added)' ? (
    <TableCell className={classes.lookupEditCell}>
      <TextField
        id="date"
        type="date"
        onChange={event => onValueChange(event.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth={true}
      />
    </TableCell>
  ) : (
    <TableCell>-</TableCell>
  );

export const LookupEditCell = withStyles(styles, {
  name: 'ControlledModeDemo',
})(LookupEditCellBase);

const EditCell = props => {
  const { column, tableRow } = props;

  tableRow.type.toString() === 'Symbol(added)'
    ? console.log(tableRow.type.toString())
    : undefined;
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
    color={'primary'}
    label={value ? 'Active' : 'Returned'}
    icon={value ? <CheckIcon /> : <CancelIcon />}
    style={
      value
        ? {
            backgroundColor: 'rgba(0,128,0)',
            width: '110px',
            justifyContent: 'left',
          }
        : { backgroundColor: 'rgba(204,0,0)' }
    }
  />
);

//////////////////////////////// DATE///////////////////////////////
const DateFormatter = ({ value }) =>
  value !== null ? moment(value).format('DD-MM-YYYY') : value;

const DateTypeProvider = props => (
  <DataTypeProvider formatterComponent={DateFormatter} {...props} />
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

    // STATE
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
        { columnName: 'loaner', wordWrapEnabled: true, width: 170 },
        { columnName: 'loanDate', wordWrapEnabled: true, width: 165 },
        { columnName: 'returnDate', wordWrapEnabled: true, width: 165 },
        { columnName: 'dueDate', wordWrapEnabled: true, width: 165 },
        { columnName: 'isActive', wordWrapEnabled: true },
      ],
      editingColumns: [
        { columnName: 'idCode', editingEnabled: false },
        { columnName: 'deviceType', editingEnabled: false },
        { columnName: 'manufacture', editingEnabled: false },
        { columnName: 'model', editingEnabled: false },
        { columnName: 'loaner', editingEnabled: false },
        { columnName: 'loanDate', editingEnabled: false },
        { columnName: 'returnDate', editingEnabled: true },
        { columnName: 'dueDate', editingEnabled: false },
      ],
      sorting: [],

      addedRows: [],
      disableRows: ['isActive'],
      defaultHiddenColumnNames: ['deviceType', 'manufacture', 'model'],
      dateColumns: ['loanDate', 'returnDate', 'dueDate'],
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
        'dueDate',
        'returnDate',
        'isActive',
      ],
      client: props.client,
      data: [],
      loading: true,
      client: props.client,
    };
    // STATE ENS

    // FUNCTIONS

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
                isActive: true,
              }
        ),
      });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      let { data, client } = this.state;
      if (added) {
        console.log(added);
        let id = null;

        try {
          added.map(row => {
            console.log('row', row.idCode);
            client
              .mutate({
                variables: {
                  loanDate: row.loanDate,
                  dueDate: row.dueDate,
                  devIdCode: row.idCode,
                  loaner: row.loaner,
                },
                refetchQueries: [{ query: CURRENTUSER }],

                mutation: LOAN_ADD_MUTATION,
              })
              .then(result => {
                console.log('RESULT ', result),
                  (id = result.data.loanCreate.loan.id);
                console.log('RowID', id);
                data = [
                  ...data,
                  ...added.map((row, index) => ({
                    id: id,
                    ...row,
                  })),
                ];

                this.setState({ data: data });
              })
              .catch(error => {
                console.log(error);
                // this.setState({ errorMsgAdded: 'Loan add failed!' });
              });
          });
        } catch (e) {
          console.log(e);
        }

        console.log('ADDED', added);
      }

      if (changed) {
        let idCodeDefault = null;
        let idLoan = null;

        data = data.map(row =>
          changed[row.id] ? { ...row, ...changed[row.id] } : row
        );
        console.log('changed ', changed);

        data.map(row => {
          changed[row.id] ? (idLoan = row.id) : row;

          if (idLoan === row.id) {
            console.log(idLoan);
            client
              .mutate({
                variables: {
                  id: row.id,
                  returnDate: row.returnDate,
                },
                mutation: LOAN_RETURN_MUTATION,
              })
              .then(result => {
                row.isActive = false;

                console.log('RESULT ', result);
                this.setState({ data: data });
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
      }
      if (deleted) {
        rows = this.deleteRows(deleted);
      }
      //this.setState({ data });
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

  // STARTING QUERY
  async componentDidMount() {
    let temp = await this.state.client.query({ query: LOANS_QUERY });
    let tempEmails = await this.state.client.query({ query: EMAILS_QUERY });
    let tempIdCodes = await this.state.client.query({ query: DEVICE_ID_QUERY });

    let temp2 = [];
    if (temp.data.allLoans) {
      temp.data.allLoans.map(
        (obj, i) =>
          (temp2[i] = {
            id: obj.id,
            loanDate: obj.loanDate !== null ? obj.loanDate : null,
            returnDate: obj.returnDate !== null ? obj.returnDate : null,
            dueDate: obj.dueDate !== null ? obj.dueDate : null,
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
    //console.log('emails', tempEmails);
    emails = tempEmails.data.allUsers;
    arrayIdCodes = editIdCodes(tempIdCodes.data.allDevices);
    //console.log(idCodes);
    this.setState({ data: temp2, loading: false });
    //  console.log(temp2);
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
      loading,
      defaultHiddenColumnNames,
      dateColumns,
      disableRows,
    } = this.state;

    if (loading) {
      return <Loading />;
    } else {
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
            <DateTypeProvider for={dateColumns} />

            <VirtualTable
              columnExtensions={tableColumnExtensions}
              className={classes.table}
              rowComponent={TableRow}
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
            <TableColumnVisibility
              defaultHiddenColumnNames={defaultHiddenColumnNames}
            />
            <Toolbar />
            <ColumnChooser />
            <SearchPanel />
            <ToolbarTitle title="Loans" />
          </Grid>
        </Paper>
      );
    }
  }
}

// EXPORT
export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Loans)
);
