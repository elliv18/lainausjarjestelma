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
  ColumnChooser,
  TableColumnVisibility,
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
import ToolbarTitle from '../src/ToolbarTitle';
import TextField from '@material-ui/core/TextField';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo, Mutation } from 'react-apollo';
import { USERS_QUERY, EMAILS_QUERY } from '../lib/gql/queries';
import {
  USERS_ADD_MUTATION,
  USERS_UPDATE_MUTATION,
  USER_ISACTIVE_MUTATION,
  USER_UPDATE_PW_MUTATION,
} from '../lib/gql/mutation';

import Moment from 'react-moment';
import 'moment-timezone';
import Loading from './Loading';

let pw = null;
let pw2 = null;

const RowDetail = ({ row }) => (
  <Mutation mutation={USER_UPDATE_PW_MUTATION}>
    {(userUpdatePW, { error }) => (
      <div>
        <div>
          <TextField
            id="new_pw"
            label="New password"
            type="password"
            onChange={e => {
              pw = e.target.value;
            }}
          />
        </div>

        <div>
          <TextField
            id="new_pw_check"
            label="Again new password"
            type="password"
            onChange={e => {
              pw2 = e.target.value;
            }}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Button
            style={{ backgroundColor: 'grey' }}
            onClick={() => {
              if (pw === pw2 && pw !== null && pw2 !== null) {
                userUpdatePW({
                  variables: { id: row.id, password: pw },
                }).then();
                console.log(row.id);
              } else if (pw === null || pw2 === null) {
                console.log('Password can not be null!!');
              } else {
                console.log('Passwords not match!');
              }
            }}
          >
            Change password
          </Button>
        </div>
        {error ? console.log(error) : null}
      </div>
    )}
  </Mutation>
);

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
  toolbarTitle: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.action.active,
    color: 'red',
    marginLeft: '5%',
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

const availableValues = {
  userType: ['ADMIN', 'STAFF', 'STUDENT'],
};

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
    color={'primary'}
    label={value ? 'Active' : 'Inactive'}
    icon={value ? <CheckIcon /> : <CancelIcon />}
    style={
      value
        ? {
            backgroundColor: '#018E42',
            width: '105px',
            justifyContent: 'left',
          }
        : { backgroundColor: '#DB2B39' }
    }
  />
);

const getRowId = row => row.id;
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

class Users extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'userType', title: 'Type' },
        { name: 'firstName', title: 'Firstname' },
        { name: 'lastName', title: 'Lastname' },
        { name: 'email', title: 'Email' },
        { name: 'isActive', title: 'Active status' },
        { name: 'address', title: 'Address' },
        { name: 'personNumber', title: 'Person number' },
        { name: 'phone', title: 'Phone' },
        //  { name: 'createdAt', title: 'Created' },
        //   { name: 'updatedAt', title: 'Updated' }
      ],
      tableColumnExtensions: [
        { columnName: 'userType', wordWrapEnabled: true, width: 130 },
        { columnName: 'firstName', wordWrapEnabled: true, width: 120 },
        { columnName: 'lastName', wordWrapEnabled: true, width: 130 },
        { columnName: 'email', wordWrapEnabled: true, width: 300 },
        { columnName: 'isActive', wordWrapEnabled: true },
        { columnName: 'address', wordWrapEnabled: true },
        { columnName: 'personNumber', wordWrapEnabled: true },
        { columnName: 'phone', wordWrapEnabled: true },
        { columnName: 'createdAt', wordWrapEnabled: true },
        { columnName: 'updatedAt', wordWrapEnabled: true },
      ],
      editingColumns: [
        { columnName: 'userType', editingEnabled: true },
        { columnName: 'firstName', editingEnabled: true },
        { columnName: 'lastName', editingEnabled: true },
        { columnName: 'email', editingEnabled: true },
        { columnName: 'isActive', editingEnabled: false },
        { columnName: 'address', editingEnabled: true },
        { columnName: 'personNumber', editingEnabled: true },
        { columnName: 'phone', editingEnabled: true },
        { columnName: 'createdAt', editingEnabled: false },
        { columnName: 'updatedAt', editingEnabled: false },
      ],
      rows: [],
      defaultSorting: [{ columnName: 'isActive', direction: 'dec' }],
      sortingStateColumnExtensions: [
        { columnName: 'isActive', sortingEnabled: false },
      ],
      sorting: [
        { columnName: 'isActive', direction: 'desc' },
        { columnName: 'firstName', direction: 'asc' },
      ],
      editingRowIds: [],
      addedRows: [],
      defaultHiddenColumnNames: [],
      rowChanges: {},
      pageSize: 0,
      booleanColumns: ['isActive'],
      columnOrder: [
        'userType',
        'firstName',
        'lastName',
        'email',
        'phone',
        'address',
        'personNumber',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      client: props.client,
      data: [],
      loading: true,
      errorMsgAdded: null,
    };

    const getStateRows = () => {
      const { data } = this.state;
      return data;
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
                userType: availableValues.userType[2],
                isActive: true,
              }
        ),
      });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      let { rows, data, client } = this.state;
      if (added) {
        let id = null;
        try {
          //const startingAddedId =
          //data.length > 0 ? data[data.length - 1].id + 1 : 0;

          added.map(row => {
            client
              .mutate({
                variables: {
                  isActive: true,
                  userType: row.userType,
                  email: row.email,
                  password: 'Salasana',
                  firstName: row.firstName,
                  lastName: row.lastName,
                  address: row.address,
                  personNumber: row.personNumber,
                  phone: row.phone,
                },
                refetchQueries: [{ query: EMAILS_QUERY }],
                mutation: USERS_ADD_MUTATION,
              })
              .then(result => {
                console.log('RESULT ', result),
                  (id = result.data.userCreate.user.id);

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
                this.setState({ errorMsgAdded: 'User add failed!' });
              });
          });
        } catch (e) {
          console.log('ERROR: ', e);
        }
      }
      if (changed) {
        let idUser = null;

        data = data.map(row =>
          changed[row.id] ? { ...row, ...changed[row.id] } : row
        );
        console.log('CHANGED', changed);
        //  console.log("ID", id);

        data.map(row => {
          changed[row.id] ? (idUser = row.id) : row;
          if (row.id === idUser) {
            client
              .mutate({
                variables: {
                  id: row.id,
                  isActive: row.isActive,
                  userType: row.userType,
                  email: row.email,
                  firstName: row.firstName,
                  lastName: row.lastName,
                  address: row.address,
                  personNumber: row.personNumber,
                  phone: row.phone,
                },
                mutation: USERS_UPDATE_MUTATION,
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
        let tempData = [];

        // data = this.deleteRows(deleted);
        //  console.log(deleted[0]);

        // console.log('data', data);
        //console.log('isActive', data.isActive);
        data.map((row, i) => {
          if (row.id === deleted[0]) {
            console.log('DATA', data[i].isActive);

            if (row.isActive === true) {
              //console.log('isactive true');
              client
                .mutate({
                  variables: { id: deleted[0], isActive: false },
                  mutation: USER_ISACTIVE_MUTATION,
                })
                .then(Response => {
                  console.log(Response.data.userIsActive.user);
                  data = data.map(row =>
                    row.id === deleted[0]
                      ? Response.data.userIsActive.user
                      : row
                  );
                  this.setState({ data: data });
                });
              // this.setState({ data: data });
            }
          }
        });
      }
      // this.setState({ rows });
    };

    this.deleteRows = deletedIds => {
      const data = getStateRows().slice();
      deletedIds.forEach(rowId => {
        console.log('deletedID', deletedIds);
        const index = data.findIndex(row => row.id === rowId);
        if (index > -1) {
          console.log('dataSplice', data);

          data.splice(index, 1);
        }
      });
      //console.log('data', data);

      return data;
    };
    this.changeColumnOrder = order => {
      this.setState({ columnOrder: order });
    };
  }

  async componentDidMount() {
    let temp = await this.state.client.query({
      query: USERS_QUERY,
    });
    let temp2 = [];
    if (temp.data.allUsers) {
      temp.data.allUsers.map(
        (obj, i) =>
          (temp2[i] = {
            id: obj.id,
            userType: obj.userType,
            isActive: obj.isActive,
            lastName: obj.lastName,
            email: obj.email,
            firstName: obj.firstName,
            address: obj.address,
            phone: obj.phone,
            personNumber: obj.personNumber,
            createdAt:
              obj.createdAt !== null ? <Moment>{obj.createdAt}</Moment> : null,
            updatedAt:
              obj.updatedAt !== null ? <Moment>{obj.updatedAt}</Moment> : null,
          })
      );
    }
    this.setState({ data: temp2, loading: false });
  }

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
      pageSize,
      columnOrder,
      booleanColumns,
      editingColumns,
      loading,
      defaultHiddenColumnNames,
      defaultSorting,
      sortingStateColumnExtensions,
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
              defaultSorting={defaultSorting}
              columnExtensions={sortingStateColumnExtensions}
            />
            <PagingState
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
            <ToolbarTitle title="Users" />
          </Grid>
        </Paper>
      );
    }
  }
}

export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Users)
);
