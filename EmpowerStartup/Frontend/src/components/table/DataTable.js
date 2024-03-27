import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ContentLoader from 'react-content-loader';
import EmptyData from '../EmptyData';
import Moment from 'moment';
import { DeleteButton, SendMail } from '../ButtonWithIcon';
import TableHeader from './TableHeader';
import { Search } from '@mui/icons-material';
const DataTable = (props) => {
  var _ = require('lodash');
  const {
    selected,
    sortBy,
    sortDirection,
    onSorting,
    rows,
    count,
    rowsPerPage,
    handleChangeRowsPerPage,
    page,
    handleChangePage,
    auto,
    actions,
    actionCondition,
    enableCheckbox,
    onSelectionChange,
    onSelectionChecked,
    onSelectionUnChecked,
    validateRow,
    failedRowColor,
    successRowColor,
    // validateColumn,
    // failedColumnColor,
    // successColumnColor,
  } = props;

  const [order, setOrder] = useState(sortDirection ? sortDirection : 'asc');
  const [orderBy, setOrderBy] = useState(sortBy);
  // eslint-disable-next-line no-unused-vars
  const [searchString, setSearchString] = useState('');

  function filterIt(arr) {

    if (props.viewSearch && props.onSearch) return arr;
    if (arr && Array.isArray(arr)) {
      return arr.filter((object) => {
        return JSON.stringify(object).toString().toLowerCase().includes(searchString);
      });
    }
    return [];
  }

  const emptyRows = props.rowsPerPage - props.rows?.length;

  const handleChangeSelection = (row, checked) => {
    if (checked) {
      onSelectionChecked(row);
      onSelectionChange([...selected, row]);
    } else {
      onSelectionUnChecked(row);
      onSelectionChange(selected.filter((x) => x.id !== row.id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) onSelectionChange(rows);
    else onSelectionChange([]);
  };

  const isSelected = (row) => {
    const result = selected?.find((x) => x.id === row.id);
    return result ? true : false;
  };

  const rowsSelected = () => {
    if (selected) return selected.length;
    return 0;
  };

  const _sortBy = (arr) => {
    if (typeof onSorting === 'undefined') {
      const result = _.sortBy(arr, [orderBy]);
      if (order === 'desc') return result.reverse();
      return result;
    }
    if (arr) return arr;
    return [];
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    if (onSorting) onSorting(property, isAsc ? 'desc' : 'asc');
  };
  return (
    <div>
      <Card>
        <CardHeader title={props.title} />
        <CardContent>
          <Box py={1} px={2}>
            <Grid container>
              {/* Searchbar */}
              <Grid item xs={12} md={8}>
                {props.viewSearch && props.onSearch && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      // label="Search"
                      size="small"
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchString(e.target.value);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />&nbsp;&nbsp;
                    <Button variant="outlined" color="secondary" onClick={() => props.onSearch(searchString)}>
                      Search
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <br />
              <TableContainer>
                <Table stickyHeader size={props.dense ? 'small' : 'medium'} aria-label="sticky table" padding="default">
                  <TableHeader
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={props.rows?.length}
                    columns={props.columns}
                    enableCheckbox={enableCheckbox}
                    numSelected={rowsSelected()}
                    onSelectAllClick={handleSelectAll}
                  />
                  <TableBody>
                    {props.loading === true ? (
                      <TableRow>
                        <TableCell colSpan={props.columns.length} rowSpan={props.columns.length}>
                          <ContentLoader viewBox="0 0 380 70">
                            {/* Only SVG shapes */}
                            <rect x="0" y="0" width="100%" height="10" />
                            <rect x="0" y="12" width="70%" height="10" />
                            <rect x="0" y="24" width="50%" height="10" />
                            <rect x="0" y="36" width="75%" height="10" />
                            <rect x="0" y="48" width="90%" height="10" />
                            <rect x="0" y="60" width="98%" height="10" />
                            <rect x="0" y="72" width="100%" height="10" />
                          </ContentLoader>
                        </TableCell>
                      </TableRow>
                    ) : props.rows?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={props.columns.length} rowSpan={props.columns.length}>
                          <EmptyData />
                        </TableCell>
                      </TableRow>
                    ) : auto === true ? (
                      _sortBy(filterIt(rows))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                        .map((row) => {
                          let rowBackgroundColor = '';
                          let rowFontColor = '#000000';
                          if (validateRow && validateRow(row)) {
                            rowBackgroundColor = successRowColor;
                            rowFontColor = '#000000';
                          } else if (validateRow) {
                            rowFontColor = '#FFFFFF';
                            // eslint-disable-next-line
                            rowBackgroundColor = failedRowColor;
                          }
                        

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                              style={{
                                height: '50px',
                                backgroundColor: isSelected(row) ? 'lightgray' : '',
                              }}
                            >
                              {enableCheckbox ? (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isSelected(row)}
                                    onChange={(event) => {
                                      handleChangeSelection(row, event.target.checked);
                                    }}
                                    inputProps={{
                                      'aria-label': 'Select a row',
                                    }}
                                  />
                                </TableCell>
                              ) : null}
                              {props.columns.map((column) => {
                                let value = row[column.id];
                                if (value == null && column.level1 != null) {
                                  value = row[column.level1][column.id];
                                }

                                return column.id === 'actions' ? (
                                  <>
                                    <Actions
                                      id={column.id}
                                      row={row}
                                      align={column?.align}
                                      actions={actions}
                                      viewSendMail={props.viewSendMail}
                                      onSendMail={props.onSendMail}
                                      viewDelete={props.viewDelete}
                                      onDelete={props.onDelete}
                                      onConditionCheck={(row) => actionCondition(row)}
                                    />
                                  </>
                                ) : (
                                  <>
                                  <ColumnValueRender
                                    column={column}
                                    row={row}
                                    props={props}
                                    rowFontColor={rowFontColor}
                                  />
                                  </>
                                );
                              })}
                            </TableRow>
                          );
                        })
                    ) : (
                      _sortBy(filterIt(props?.rows)).map((row) => {
                        let rowBackgroundColor = '';
                        let rowFontColor = '#000000';
                        if (validateRow && validateRow(row)) {
                          rowBackgroundColor = successRowColor;
                          rowFontColor = '#FFFFFF';
                        } else if (validateRow) {
                          rowFontColor = '#FFFFFF';
                          rowBackgroundColor = failedRowColor;
                        }
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                            style={{
                              height: '50px',
                              background: rowBackgroundColor,
                            }}
                            selected={isSelected(row)}
                          >
                            {enableCheckbox ? (
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isSelected(row)}
                                  onChange={(event) => {
                                    handleChangeSelection(row, event.target.checked);
                                  }}
                                  inputProps={{
                                    'aria-label': 'Select a row',
                                  }}
                                />
                              </TableCell>
                            ) : null}
                            {props.columns?.map((column) => {
                              return column.id === 'actions' ? (
                                <Actions
                                  onConditionCheck={actionCondition}
                                  id={column.id}
                                  row={row}
                                  align={column?.align}
                                  actions={props.actions}
                                  viewDelete={props.viewDelete}
                                  onDelete={props.onDelete}
                                  viewSendMail={props.viewSendMail}
                                  onSendMail={props.onSendMail}
                                />
                              ) : (
                                <ColumnValueRender
                                  column={column}
                                  row={row}
                                  props={props}
                                  rowFontColor={rowFontColor}
                                />
                              );
                            })}
                          </TableRow>
                        );
                      })
                    )}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: (props.dense ? 33 : 53) * emptyRows }}>
                        <TableCell colSpan={props.columns.length} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50,100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;

const ColumnValueRender = ({ column, row, props, rowFontColor }) => {
  var Component = column.component;
  let value = row[column.id];
  if (value == null && column.level1 != null) {
    value = row[column.level1][column.id];
  }

  return (
    <TableCell
      style={{
        color: rowFontColor,
        cursor: props.viewEdit ? 'pointer' : 'default',
      }}
      onClick={() => (props.viewEdit ? props.onEdit(row) : 'null')}
      align={column.format && column.format === 'number' ? 'right' : 'left'}
    >
      {column.component ? (
        <Component row={row} />
      ) : (
        <Typography align={column.format && column.format === 'number' ? 'right' : 'left'}>
          {column.format && typeof value === 'object' ? value[column.key] : format(column.format, value)}
        </Typography>
      )}
    </TableCell>
  );
};

const Actions = ({ id, align, row, viewDelete, onDelete, viewSendMail, onSendMail, actions, onConditionCheck }) => {
  const checkCondition = () => {
    if (onConditionCheck) return onConditionCheck(row);
    return true;
  };
  const alignmentForCell = align;
  const alignmentForBox = align === 'left' ? 'flex-start' : 'flex-end';
  return (
    <TableCell width="auto" align={alignmentForCell} key={id}>
      <Box display="flex" justifyContent={alignmentForBox}>
        {actions && checkCondition
          ? actions.map((action) => {
              const Component = action.component;
              return <Box mr={1}>{Component(row)}</Box>;
            })
          : null}
        {viewDelete ? (
          <Box mr={1}>
            <DeleteButton onClick={() => onDelete(row)} />
          </Box>
        ) : null}
        {viewSendMail ? (
          <Box mr={1}>
            <SendMail onClick={() => onSendMail(row)} />
          </Box>
        ) : null}
      </Box>
    </TableCell>
  );
};

function format(formatType, value) {
  if (value) {
    switch (formatType) {
      case 'date':
        if (Moment(value).isAfter(Moment('01-01-0001'))) return Moment(value).format('DD-MM-YYYY');
        return '-';
      case 'dateTime':
        if (Moment(value).isAfter(Moment('01-01-0001'))) return Moment(value).format('DD-MM-YYYY HH:mm');
        return '-';
      case 'time':
        if (Moment(value).isAfter(Moment('01-01-0001'))) return Moment(value).format('LT');
        return '-';
      case 'number':
        return typeof value === 'number' ? value.toFixed(2) : typeof value !== 'undefined' ? value : 0.0;
      default:
        return value;
    }
  } else return '-';
}
