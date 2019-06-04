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
  ColumnChooser,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import ToolbarTitle from '../src/ToolbarTitle';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo } from 'react-apollo';
import {
  EQUIPMENTS_QUERY,
  CATEGORY_NAME_QUERY,
  DEVICE_ID_QUERY,
} from '../lib/gql/queries';
import {
  EQUIPMENT_ADD_MUTATION,
  EQUIPMENT_UPDATE_MUTATION,
  EQUIPMENT_DELETE_MUTATION,
} from '../lib/gql/mutation';
import Loading from './Loading';
import Select from 'react-select';

/********************* STYLES **************************/

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
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

/***************************** FUNCTIONS ***************************/

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
  deviceCategory: String,
};

let categoryNames = [];
let arrayCategoryNames = [];
let selectedValue = '';
let selectedRowNumber = null;

function editCategories() {
  let temp = [];
  categoryNames.map((row, i) => {
    temp[i] = {
      label: row.deviceCategory,
      value: row.deviceCategory,
    };
  });
  return temp;
}

const LookupEditCellBase = ({
  availableColumnValues,
  value,
  onValueChange,
  classes,
}) => (
  <TableCell className={classes.lookupEditCell}>
    <Select
      options={(arrayCategoryNames = editCategories())}
      //onChange={opt => console.log(opt.label, opt.value)}
      //defaultInputValue="123"
      // onChange={opt => console.log(opt.label, opt.value)}
      onChange={event => onValueChange(event.value)}
    />
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
    label={value ? 'Loaned' : 'Available'}
    icon={value ? <CancelIcon /> : <CheckIcon />}
    style={
      value
        ? {
            backgroundColor: '#DB2B39',
            width: '115px',
            justifyContent: 'left',
          }
        : { backgroundColor: '#018E42' }
    }
  />
);

const getRowId = row => row.id;

/******************************** CLASS ***************************************/

class Equipments extends React.PureComponent {
  constructor(props) {
    super(props);

    // STATE
    this.state = {
      columns: [
        { name: 'idCode', title: 'Serial number' },
        { name: 'deviceCategory', title: 'Category' },
        { name: 'manufacture', title: 'Manufacture' },
        { name: 'model', title: 'Model' },
        { name: 'info', title: 'Info' },
        { name: 'loanStatus', title: 'Loan' },
      ],
      tableColumnExtensions: [
        { columnName: 'idCode', wordWrapEnabled: true },
        { columnName: 'deviceCategory', wordWrapEnabled: true },
        { columnName: 'manufacture', wordWrapEnabled: true },
        { columnName: 'model', wordWrapEnabled: true },
        { columnName: 'info', wordWrapEnabled: true },
        { columnName: 'loanStatus', wordWrapEnabled: true },
      ],
      editingColumns: [
        { columnName: 'idCode', editingEnabled: true },
        { columnName: 'deviceCategory', editingEnabled: true },
        { columnName: 'manufacture', editingEnabled: true },
        { columnName: 'model', editingEnabled: true },
        { columnName: 'info', editingEnabled: true },
      ],
      sorting: [],
      editingRowIds: [
        'idCode',
        'deviceCategory',
        'manufacture',
        'model',
        'info',
      ],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      pageSize: 0,
      booleanColumns: ['loanStatus'],
      defaultHiddenColumnNames: [],

      columnOrder: [
        'idCode',
        'deviceCategory',
        'manufacture',
        'model',
        'info',
        'loanStatus',
      ],
      client: props.client,
      data: [],
      loading: true,
    };

    // STATE ENDS

    // FUNCTIONS

    const getStateRows = () => {
      const { data } = this.state;
      return data;
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds =>
      this.setState({ editingRowIds });
    this.changeAddedRows = addedRows =>
      this.setState({
        addedRows: addedRows.map(row => (Object.keys(row).length ? row : {})),
      });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.commitChanges = ({ added, changed, deleted }) => {
      let { rows, data, client } = this.state;
      if (added) {
        console.log('added', added);
        let id = null;

        added.map(row => {
          console.log(row.deviceCategory);
          client
            .mutate({
              variables: {
                idCode: row.idCode,
                manufacture: row.manufacture,
                model: row.model,
                info: row.info,
                deviceCategory: row.deviceCategory,
              },
              refetchQueries: [{ query: DEVICE_ID_QUERY }],
              mutation: EQUIPMENT_ADD_MUTATION,
            })
            .then(result => {
              console.log('RESULT ', result),
                (id = result.data.deviceCreate.device.id);
              console.log('RowID', id);
              data = [
                ...data,
                ...added.map((row, index) => ({
                  id: id,
                  ...row,
                })),
              ];

              this.setState({ data: data });
              console.log(data);
            })
            .catch(error => {
              console.log(error);
              // this.setState({ errorMsgAdded: 'Loan add failed!' });
            });
        });
        this.setState({ data: data });
      }
      if (changed) {
        let idDevice = null;
        data = data.map(row =>
          changed[row.id] ? { ...row, ...changed[row.id] } : row
        );
        console.log('DATA', data);

        console.log('CHANGED', changed);

        data.map((row, i) => {
          changed[row.id] ? (idDevice = row.id) : row;

          if (row.id === idDevice) {
            console.log('number', selectedRowNumber);
            //console.log('ID', idDevice);
            //console.log('idCode', row.deviceCategory);
            client
              .mutate({
                variables: {
                  idCode: row.idCode,
                  manufacture: row.manufacture,
                  model: row.model,
                  info: row.info,
                  deviceCategory: row.deviceCategory,
                },
                mutation: EQUIPMENT_UPDATE_MUTATION,
              })
              .then(result => console.log('RESULT ', result))
              .catch(error => {
                console.log(error);
              });
          }
        });
        this.setState({ data: data });
      }
      if (deleted) {
        console.log(deleted[0]);

        // console.log('data', data);

        client
          .mutate({
            variables: { id: deleted[0] },
            mutation: EQUIPMENT_DELETE_MUTATION,
          })
          .then(response => {
            console.log(Response), (data = this.deleteRows(deleted));
          })
          .catch(error => console.log(error));

        this.setState({ data: data });
      }
      //this.setState({ data: data });
    };
    this.deleteRows = deletedIds => {
      const data = getStateRows().slice();
      deletedIds.forEach(rowId => {
        const index = data.findIndex(row => row.id === rowId);
        if (index > -1) {
          data.splice(index, 1);
        }
      });
      return data;
    };
    this.changeColumnOrder = order => {
      this.setState({ columnOrder: order });
    };
  }

  // STARTING QUERY
  async componentDidMount() {
    let temp = await this.state.client.query({ query: EQUIPMENTS_QUERY });
    let tempCategories = await this.state.client.query({
      query: CATEGORY_NAME_QUERY,
    });

    let temp2 = [];
    if (temp.data.allDevices) {
      temp.data.allDevices.map(
        (obj, i) =>
          (temp2[i] = {
            id: obj.id,
            idCode: obj.idCode,
            info: obj.info,
            loanStatus: obj.loanStatus,
            manufacture: obj.manufacture,
            model: obj.model,
            deviceCategory: obj.category.deviceCategory,
          })
      );
    }
    // console.log(tempCategories.data.allCategories);
    //console.log(temp2);
    categoryNames = tempCategories.data.allCategories;
    this.setState({ data: temp2, loading: false });
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
    } = this.state;

    if (loading) {
      return <Loading />;
    } else {
      return (
        <Paper className={classes.root} elevation={5}>
          <Grid rows={data} columns={columns} getRowId={getRowId}>
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

            <VirtualTable columnExtensions={tableColumnExtensions} />
            <TableColumnReordering
              order={columnOrder}
              onOrderChange={this.changeColumnOrder}
            />
            <TableHeaderRow showSortingControls />
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
            <ToolbarTitle title="Equipments" />
          </Grid>
        </Paper>
      );
    }
  }
}

// EXPORT
export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Equipments)
);
