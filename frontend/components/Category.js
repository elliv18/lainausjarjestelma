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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import { withApollo } from 'react-apollo';
import {
  CATEGORY_QUERY,
  EQUIPMENTS_QUERY,
  CATEGORY_NAME_QUERY,
  DEVICE_ID_QUERY,
  BACKENDTEST_QUERY,
} from '../lib/gql/queries';
import {
  CURRENTUSER,
  CATEGORY_ADD_MUTATION,
  CATEGORY_UPDATE_MUTATION,
  CATEGORY_DELETE_MUTATION,
} from '../lib/gql/mutation';
import Moment from 'react-moment';
import 'moment-timezone';
import Loading from './Loading';
import ToolbarTitle from '../src/ToolbarTitle';

import Router from 'next/router';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

/*********************** STYLES *****************************/
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

/***************************** SUPPORT FUNCTIONS ************************************/

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
      if (
        window.confirm(
          'Are you sure you want to delete this category AND ALL ITS DEVICES?'
        )
      ) {
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
    color={value ? 'primary' : 'secondary'}
    label={value ? 'Active' : 'Inactive'}
    icon={value ? <CheckIcon /> : <CancelIcon />}
    style={
      value
        ? {
            backgroundColor: 'rgba(0,128,0,0.75)',
            width: '105px',
            justifyContent: 'left',
          }
        : { backgroundColor: 'rgba(204,0,0,0.85)' }
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

/************************* MAIN CLASS ************************************/

class Category extends React.PureComponent {
  constructor(props) {
    super(props);

    // STATE

    this.state = {
      columns: [
        { name: 'deviceCategory', title: 'Category' },
        { name: 'desription', title: 'Desription' },
        { name: 'createdAt', title: 'Created' },
        { name: 'updatedAt', title: 'Updated' },
      ],
      tableColumnExtensions: [
        { columnName: 'deviceCategory', wordWrapEnabled: true, width: 150 },
        { columnName: 'desription', wordWrapEnabled: true },
        { columnName: 'createdAt', wordWrapEnabled: true, width: 130 },
        { columnName: 'updatedAt', wordWrapEnabled: true, width: 130 },
      ],
      editingColumns: [
        { columnName: 'deviceCategory', editingEnabled: true },
        { columnName: 'desription', editingEnabled: true },
        { columnName: 'createdAt', editingEnabled: false },
        { columnName: 'updatedAt', editingEnabled: false },
      ],
      rows: [],
      sorting: [{ columnName: 'deviceCategory', direction: 'asc' }],
      editingRowIds: [],
      addedRows: [],
      defaultHiddenColumnNames: [],
      rowChanges: {},
      pageSize: 0,
      booleanColumns: [],
      columnOrder: ['deviceCategory', 'desription', 'createdAt', 'updatedAt'],
      client: props.client,
      data: [],
      loading: true,
      errorMsgAdded: null,
      currentUser: null,
      isBackend: false,
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
        added.map(row => {
          client
            .mutate({
              variables: {
                deviceCategory: row.deviceCategory,
                desription: row.desription,
              },
              refetchQueries: [
                { query: CATEGORY_NAME_QUERY },
                { query: CATEGORY_QUERY },
              ],
              mutation: CATEGORY_ADD_MUTATION,
            })
            .then(result => {
              console.log('RESULT ', result);
              data = [
                ...data,
                ...added.map((row, index) => ({
                  id: result.data.categoryCreate.category.id,
                  deviceCategory:
                    result.data.categoryCreate.category.deviceCategory,
                  ...row,
                })),
              ];
            })
            .catch(error => {
              console.log(error);
              this.setState({ errorMsgAdded: 'Category add failed!' });
            });
        });

        this.setState({ data: data });
      }
      if (changed) {
        let idCategory = null;

        data = data.map(row =>
          changed[row.id] ? { ...row, ...changed[row.id] } : row
        );

        data.map(row => {
          changed[row.id] ? (idCategory = row.id) : row;
          if (row.id === idCategory) {
            client
              .mutate({
                variables: {
                  id: row.id,
                  deviceCategory: row.deviceCategory,
                  desription: row.desription,
                },
                mutation: CATEGORY_UPDATE_MUTATION,
                refetchQueries: [{ query: CATEGORY_QUERY }],
              })
              .then(
                result => console.log('RESULT ', result),
                this.setState({ data: data })
              )
              .catch(error => {
                console.log(error);
              });
          }
        });
      }
      if (deleted) {
        client
          .mutate({
            variables: { id: deleted[0] },
            mutation: CATEGORY_DELETE_MUTATION,
            refetchQueries: [{ query: EQUIPMENTS_QUERY }],
          })
          .then(response => {
            console.log(Response), (data = this.deleteRows(deleted));
            this.setState({ data: data });
          })
          .catch(error => console.log(error));
      }

      this.setState({ rows });
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

  // STARTING DATA GET
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
        console.log(this.state.isBackend);
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
        this.state.currentUser !== 'ADMIN'
          ? Router.push({
              pathname: '/',
            })
          : ((temp = await this.state.client
              .query({
                query: CATEGORY_QUERY,
              })
              .catch(e => console.log(e))),
            temp && temp.data.allCategories
              ? temp.data.allCategories.map(
                  (obj, i) =>
                    (temp2[i] = {
                      id: obj.id,
                      deviceCategory: obj.deviceCategory,
                      desription: obj.desription,
                      createdAt:
                        obj.createdAt !== null ? (
                          <Moment format="DD-MM-YYYY HH:mm">
                            {obj.createdAt}
                          </Moment>
                        ) : null,
                      updatedAt:
                        obj.updatedAt !== null ? (
                          <Moment format="DD-MM-YYYY HH:mm">
                            {obj.updatedAt}
                          </Moment>
                        ) : null,
                    })
                )
              : null,
            this.setState({ data: temp2, loading: false })))
      : (this.setState({ isBackend: false }),
        Router.push({
          pathname: '/login',
        }));
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
      pageSize,
      columnOrder,
      booleanColumns,
      editingColumns,
      loading,
      defaultHiddenColumnNames,
      currentUser,
    } = this.state;

    if (loading) {
      return <Loading />;
    } else if (!loading && currentUser !== 'STUDENT') {
      return (
        <Paper className={classes.root} elevation={12}>
          <MuiThemeProvider theme={theme2}>
            <Grid rows={data} columns={columns} getRowId={getRowId}>
              <SortingState
                sorting={sorting}
                onSortingChange={this.changeSorting}
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
              <TableHeaderRow
                showSortingControls
                contentComponent={TableHeaderContent}
                rowComponent={TableHeaderRowStyle}
              />
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
              <Toolbar rootComponent={ToolbarRoot} />
              <ColumnChooser />
              <SearchPanel />
              <ToolbarTitle title="Device Categories" />
            </Grid>
          </MuiThemeProvider>
        </Paper>
      );
    } else {
      return null;
    }
  }
}

// EXPORT
export default withStyles(styles, { name: 'ControlledModeDemo' })(
  withApollo(Category)
);
