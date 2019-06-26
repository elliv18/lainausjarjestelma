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
  Table,
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
import DeleteIcon from '@material-ui/icons/ImportExport';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo, Mutation } from 'react-apollo';
import {
  USERS_QUERY,
  EMAILS_QUERY,
  BACKENDTEST_QUERY,
} from '../lib/gql/queries';
import {
  CURRENTUSER,
  USERS_ADD_MUTATION,
  USERS_UPDATE_MUTATION,
  USER_ISACTIVE_MUTATION,
  USER_UPDATE_PW_MUTATION,
} from '../lib/gql/mutation';

import Moment from 'react-moment';
import 'moment-timezone';
import Loading from './Loading';

import Router from 'next/router';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme2 = createMuiTheme({
  palette: {
    action: {
      active: 'rgba(255,255,255, 1)',
    },
  },
  overrides: {
    MuiInput: {
      underline: {
        '&:after': {
          borderBottomColor: '#D2D1CB',
        },
        '&:before': {
          borderBottomColor: '#000',
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid #000`,
        },
      },
    },
    MuiIconButton: {
      root: {
        color: false,
      },
    },
  },
});

let pw = null;
let pw2 = null;

const TableRow = ({ row, ...restProps }) => (
  <Table.Row
    {...restProps}
    style={{
      height: 60,
      backgroundColor: row.isActive == false ? '#9C9C9C' : undefined,
    }}
  />
);

const RowDetail = ({ row }) => (
  <Mutation mutation={USER_UPDATE_PW_MUTATION}>
    {userUpdatePW => (
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
            id="changePassword"
            size=""
            variant="outlined"
            color="primary"
            style={{
              textTransform: 'none',
              backgroundColor: 'rgba(0,70,85)',
              color: '#fff',
              marginBottom: 14,
            }}
            onClick={() => {
              if (pw === pw2 && pw !== null && pw2 !== null) {
                //      console.log('OK');
                userUpdatePW({
                  variables: { id: row.id, password: pw, passwordAgain: pw2 },
                })
                  .then(response => {
                    console.log(response);
                    window.alert('Password changed');
                  })
                  .catch(e => {
                    let error = e.message.replace('GraphQL error:', '').trim();
                    console.log(error);
                    window.alert(error);
                  });
              } else {
                window.alert('Fill both password fields!');
              }
              /* else if (pw === null || pw2 === null) {
                console.log('Password can not be null!!');
              } else if (pw.length < 3) {
                console.log('Password too short');
              } else {
                console.log('Passwords not match!');
              }*/
            }}
          >
            Change password
          </Button>
        </div>
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
    <Button
      variant="contained"
      style={{ color: '#fff', background: '#004655' }}
      onClick={onExecute}
      title="Create new user"
    >
      <b>New</b>
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit user">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (
        window.confirm(
          'Are you sure you want to change this user active status?'
        )
      ) {
        onExecute();
      }
    }}
    title="Change user status"
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
  userType: ['STUDENT', 'STAFF', 'ADMIN'],
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

const EditCellAdmin = props => {
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

const EditCellStaff = props => {
  const { column } = props;
  const availableColumnValues = availableValues[0];
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
            borderColor: '#018E42',
            borderStyle: 'solid',
            borderWidth: '1px',
            color: '#018E42',
            backgroundColor: 'white',
            width: '105px',
            justifyContent: 'left',
          }
        : {
            borderColor: '#DB2B39',
            borderStyle: 'solid',
            borderWidth: '1px',
            color: '#DB2B39',
            backgroundColor: '#9C9C9C',
          }
    }
  />
);

const getRowId = row => row.id;

// Header styles
const TableHeaderContentBase = ({
  column,
  children,
  classes,
  ...restProps
}) => (
  <TableHeaderRow.Content
    column={column}
    {...restProps}
    style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}
  >
    {children}
  </TableHeaderRow.Content>
);

export const TableHeaderContent = withStyles(styles, {
  name: 'TableHeaderContent',
})(TableHeaderContentBase);

const TableHeaderRowBase = ({ children, classes, ...restProps }) => (
  <TableHeaderRow.Row style={{ backgroundColor: '#D0DDE0' }}>
    {children}
  </TableHeaderRow.Row>
);

export const TableHeaderRowStyle = withStyles(styles, {
  name: 'TableHeaderRow',
})(TableHeaderRowBase);

const ToolbarRootBase = ({ children, classes, ...restProps }) => (
  <Toolbar.Root style={{ backgroundColor: '#457883', color: '#fff' }}>
    {children}
  </Toolbar.Root>
);

export const ToolbarRoot = withStyles(styles, {
  name: 'ToolbarRoot',
})(ToolbarRootBase);

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
      editingColumns: [],
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
      currentUser: null,
      isBackend: undefined,
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
                userType: availableValues.userType[0],
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
                refetchQueries: [{ query: EMAILS_QUERY, USERS_QUERY }],
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
                refetchQueries: [{ query: USERS_QUERY }],
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

        data.map((row, i) => {
          if (row.id === deleted[0]) {
            if (row.isActive === true) {
              client
                .mutate({
                  variables: { id: deleted[0], isActive: false },
                  mutation: USER_ISACTIVE_MUTATION,
                  refetchQueries: [{ query: USERS_QUERY }],
                })
                .then(Response => {
                  console.log(Response);
                  data = data.map(row =>
                    row.id === deleted[0]
                      ? Response.data.userIsActive.user
                      : row
                  );
                  this.setState({ data: data });
                });
              // this.setState({ data: data });
            } else if (row.isActive === false) {
              client
                .mutate({
                  variables: { id: deleted[0], isActive: true },
                  mutation: USER_ISACTIVE_MUTATION,
                })
                .then(Response => {
                  console.log(Response);
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

  async componentDidMount() {
    let temp = null;
    let temp2 = [];
    let CU = null;

    await this.state.client
      .query({
        query: BACKENDTEST_QUERY,
      })
      .then(result => {
        this.setState({ isBackend: true });
      })
      .catch(e => {
        console.log(e);
        this.setState({ isBackend: false });
        Router.push({
          pathname: '/login',
        });
      });

    this.state.isBackend
      ? ((CU = await this.state.client.mutate({
          mutation: CURRENTUSER,
        })),
        this.setState({ currentUser: CU.data.currentUser.userType }),
        this.state.currentUser !== 'STAFF' && this.state.currentUser !== 'ADMIN'
          ? Router.push({
              pathname: '/',
            })
          : ((temp = await this.state.client
              .query({
                query: USERS_QUERY,
              })
              .catch(e => {
                console.log(e);
              })),
            temp && temp.data.allUsers
              ? temp.data.allUsers.map(
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
                        obj.createdAt !== null ? (
                          <Moment>{obj.createdAt}</Moment>
                        ) : null,
                      updatedAt:
                        obj.updatedAt !== null ? (
                          <Moment>{obj.updatedAt}</Moment>
                        ) : null,
                    })
                )
              : null,
            this.setState({ data: temp2, loading: false }),
            this.state.currentUser === 'STAFF'
              ? this.setState({
                  editingColumns: [
                    { columnName: 'userType', editingEnabled: false },
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
                })
              : this.state.currentUser === 'ADMIN'
              ? this.setState({
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
                })
              : null))
      : (this.setState({ isBackend: false }),
        Router.push({
          pathname: '/login',
        }));
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
      currentUser,
    } = this.state;

    if (loading) {
      return <Loading />;
    } else if (!loading && currentUser !== 'STUDENT') {
      return (
        <Paper className={classes.root} elevation={12}>
          <MuiThemeProvider theme={theme2}>
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

              <VirtualTable
                columnExtensions={tableColumnExtensions}
                rowComponent={TableRow}
              />
              <TableColumnReordering
                order={columnOrder}
                onOrderChange={this.changeColumnOrder}
              />
              <TableHeaderRow
                showSortingControls
                contentComponent={TableHeaderContent}
                rowComponent={TableHeaderRowStyle}
              />

              {currentUser === 'ADMIN' ? (
                <TableRowDetail contentComponent={RowDetail} />
              ) : null}

              {currentUser === 'ADMIN' ? (
                <TableEditRow cellComponent={EditCellAdmin} />
              ) : (
                <TableEditRow cellComponent={EditCellStaff} />
              )}

              {currentUser === 'ADMIN' ? (
                <TableEditColumn
                  width={170}
                  showAddCommand={!addedRows.length}
                  showEditCommand
                  showDeleteCommand
                  commandComponent={Command}
                />
              ) : (
                <TableEditColumn
                  width={170}
                  showAddCommand={!addedRows.length}
                  commandComponent={Command}
                />
              )}

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

              <Toolbar rootComponent={ToolbarRoot} />
              <ColumnChooser />
              <SearchPanel />

              <ToolbarTitle title="Users" />
            </Grid>
          </MuiThemeProvider>
        </Paper>
      );
    } else {
      return null;
    }
  }
}

export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Users)
);
